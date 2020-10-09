import { AuthenticationError } from "apollo-server-express";
import { isContext } from "vm";
import { ServerContext } from "../../buildServerContext";
import { EmailService } from "../../service/EmailService";
import MeetRegistrationService from "../../service/MeetRegistrationService";
import MeetService from "../../service/MeetService";
import UserService from "../../service/UserService";
import { Meet, PrivateUser, PublicUser, Resolvers } from "../../types/gqlGeneratedTypes";
import MeetResolverValidator from "../../validator/MeetResolverValidator";

const meetResolver = (
  meetResolverValidator: MeetResolverValidator,
  meetService: MeetService,
  meetRegistrationService: MeetRegistrationService,
  userService: UserService,
  emailService: EmailService,
): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" meets for admin? Currently this query does not get Meets with "deleted=true"
      meets: (_root, args, context: ServerContext): Promise<Meet[]> => {
        return meetResolverValidator.getMany(args, context).then((args) => meetService.getMany(args));
      },

      meet: (_root, args, context: ServerContext): Promise<Meet> => {
        return meetService.getOne(args);
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

        return meetResolverValidator.editOne(args, context).then(({ id, input }) => meetService.editOne(id, input));
      },
      deleteMeet: (_root, args, context: ServerContext): Promise<boolean> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to delete meets!");
        }

        emailObserver.dispatch("deleteMeet");

        return meetResolverValidator.deleteOne(args).then((id) => meetService.deleteOne(id));
      },
      registerForMeet: async (_root, args, context: ServerContext): Promise<boolean> => {
        const currentUserId = context.getUserId();

        if (!currentUserId) {
          throw new AuthenticationError("You are not authorized to register for a meet! Please log in first.");
        }

        return meetResolverValidator
          .registerForMeet(args)
          .then((meetId) => meetRegistrationService.addOne({ userId: currentUserId, meetId }, context))
          .then(async ({ userId, meetId, id }) => {
            const user = await userService.getOne({ id: userId });
            const meet = await meetService.getOne({ id: meetId });
            const email = emailService.generateMeetRegistrationEmail(user, meet, id);

            return emailService.sendEmail(email); // TODO: How to handle when user is registered but email errors out?
          })
          .then((meet) => {
            emailObserver.dispatch("afterRegistration");
          })
          .then(() => true);
      },
    },

    Project: {
      meet: (project) => {
        return meetService.getOne({ id: project.meetId });
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
