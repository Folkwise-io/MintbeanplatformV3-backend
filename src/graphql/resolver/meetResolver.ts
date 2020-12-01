import { ApolloError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import MeetService from "../../service/MeetService";
import { Meet, PrivateUser, PublicUser, Resolvers } from "../../types/gqlGeneratedTypes";
import MeetResolverValidator from "../../validator/MeetResolverValidator";

import { EmailCommander } from "../../types/Email";
import MeetRegistrationDao from "../../dao/MeetRegistrationDao";
import MeetDao from "../../dao/MeetDao";
import MeetRegistrationService from "../../service/meetRegistrationService";

const meetResolver = (
  meetResolverValidator: MeetResolverValidator,
  meetService: MeetService,
  emailCommander: EmailCommander,
  meetRegistrationService: MeetRegistrationService,
  meetDao: MeetDao,
): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" meets for admin? Currently this query does not get Meets with "deleted=true"
      meets: (_root, args, context: ServerContext): Promise<Meet[]> => {
        return meetResolverValidator.getMany(args, context).then((args) => meetDao.getMany(args));
      },

      meet: (_root, args, context: ServerContext): Promise<Meet> => {
        return meetDao.getOne(args).then((result) => {
          if (!result) throw new ApolloError("Meet not found");
          return result;
        });
      },
    },

    Mutation: {
      createMeet: (_root, args, context: ServerContext): Promise<Meet> => {
        return meetResolverValidator.addOne(args, context).then((input) => meetDao.addOne(input));
      },
      editMeet: (_root, args, context: ServerContext): Promise<Meet> => {
        return meetResolverValidator.editOne(args, context).then(({ id, input }) => meetDao.editOne(id, input));
      },
      deleteMeet: (_root, args, context: ServerContext): Promise<boolean> => {
        return meetResolverValidator.deleteOne(args, context).then(({ id }) => meetDao.deleteOne(id));
      },

      // TODO: antipattern here. Force args interface to require explicit userId
      registerForMeet: async (_root, args, context: ServerContext): Promise<boolean> => {
        // TODO: get userId from args, add valid user check in meetResolverValidator once above antipattern addressed
        const userId = context.getUserId();

        return meetResolverValidator
          .registerForMeet(args, context)
          .then(({ meetId }) => meetRegistrationService.addOne({ userId, meetId }))
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
