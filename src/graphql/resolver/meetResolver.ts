import { ApolloError, AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import { EmailService } from "../../service/EmailService";
import MeetService from "../../service/MeetService";
import { Meet, PrivateUser, PublicUser, Resolvers } from "../../types/gqlGeneratedTypes";
import MeetResolverValidator from "../../validator/MeetResolverValidator";
import config from "../../util/config";
import { User } from "../../types/User";
import MeetRegistrationDao from "../../dao/MeetRegistrationDao";
import MeetDao from "../../dao/MeetDao";
import UserDao from "../../dao/UserDao";
import EmailScheduleDao from "../../dao/EmailScheduleDao";
import EmailApiDao from "../../dao/EmailApiDao";
const { disableRegistrationEmail } = config;

const meetResolver = (
  meetResolverValidator: MeetResolverValidator,
  meetService: MeetService,
  meetRegistrationDao: MeetRegistrationDao,
  userDao: UserDao,
  emailService: EmailService,
  meetDao: MeetDao,
  emailScheduleDao: EmailScheduleDao,
  emailApiDao: EmailApiDao,
): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" meets for admin? Currently this query does not get Meets with "deleted=true"
      meets: (_root, args, context: ServerContext): Promise<Meet[]> => {
        return meetResolverValidator.getMany(args, context).then((args) => meetDao.getMany(args));
      },

      meet: async (_root, args, context: ServerContext): Promise<Meet> => {
        // drop in db for cron job to send later
        // TODO: remove this - just dev testing
        const emailWithSubject = (subject: string) => ({
          to: "claire.froelich@gmail.com",
          from: "noreply@mintbean.io",
          subject,
          html: "<strong>testtttt</strong> hi",
        });
        await emailScheduleDao.send(emailWithSubject("Scheduled Email 1-" + new Date().getTime()));
        await emailScheduleDao.send(emailWithSubject("!FAIL Scheduled Email 2-" + new Date().getTime()));
        // await emailApiDao.send(email);

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

        return meetResolverValidator.addOne(args, context).then((input) => meetDao.addOne(input));
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

        return (
          meetResolverValidator
            .registerForMeet(args, context)
            .then(({ meetId }) => meetRegistrationDao.addOne({ userId, meetId }))
            // .then(async ({ userId, meetId, id }) => {
            //   if (disableRegistrationEmail) {
            //     return true;
            //   }

            //   const user = ((await userDao.getOne({ id: userId })) as unknown) as User; // temporary casting as we know user exists bc logged in user exists.
            //   const meet = await meetDao.getOne({ id: meetId });
            //   const email = emailService.generateMeetRegistrationEmail(user, meet as Meet, id);

            //   return emailService.sendEmail(email); // TODO: How to handle when user is registered but email errors out?
            // })
            .then(() => true)
        );
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
