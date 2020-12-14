import { ApolloError, AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import MeetService from "../../service/MeetService";
import { Meet, PrivateUser, PublicUser, Resolvers } from "../../types/gqlGeneratedTypes";
import MeetResolverValidator from "../../validator/MeetResolverValidator";
import MeetDao from "../../dao/MeetDao";

const meetResolver = (
  meetResolverValidator: MeetResolverValidator,
  meetService: MeetService,
  meetDao: MeetDao,
): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" meets for admin? Currently this query does not get Meets with "deleted=true"
      meets: (_root, args, context: ServerContext): Promise<Meet[]> => {
        return meetResolverValidator.getMany(args, context).then((args) => meetDao.getMany(args));
      },

      meet: async (_root, args, context: ServerContext): Promise<Meet> => {
        return meetDao.getOne(args).then((result) => {
          if (!result) throw new ApolloError("Meet not found");
          return result;
        });
      },
    },

    Mutation: {
      createMeet: (_root, args, context: ServerContext): Promise<Meet> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to create new meets!");
        }

        return meetResolverValidator.addOne(args, context).then((input) => meetService.addOne(input));
      },
      editMeet: (_root, args, context: ServerContext): Promise<Meet> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to edit meets!");
        }

        return meetResolverValidator.editOne(args, context).then(({ id, input }) => meetDao.editOne(id, input));
      },
      deleteMeet: (_root, args, context: ServerContext): Promise<boolean> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to delete meets!");
        }

        return meetResolverValidator.deleteOne(args).then(({ id }) => meetDao.deleteOne(id));
      },

      // TODO: antipattern here. Force args interface to require explicit userId
      registerForMeet: async (_root, args, context: ServerContext): Promise<boolean> => {
        // TODO: get userId from args, add valid user check in meetResolverValidator once above antipattern addressed
        const userId = context.getUserId();

        return meetResolverValidator
          .registerForMeet(args, context)
          .then(({ meetId }) => meetService.registerForMeet({ userId, meetId }))
          .then(() => true);
      },
    },

    Project: {
      meet: (project) => {
        return meetDao.getOne({ id: project.meetId }).then((result) => (result ? result : null));
      },
    },

    PublicUser: {
      registeredMeets: (user: PublicUser): Promise<Meet[]> => {
        return meetService.getRegisteredMeetsOfUser(user.id);
      },
    },

    PrivateUser: {
      registeredMeets: (user: PrivateUser): Promise<Meet[]> => {
        return meetService.getRegisteredMeetsOfUser(user.id);
      },
    },
  };
};

export default meetResolver;
