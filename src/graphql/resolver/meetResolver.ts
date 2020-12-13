import { ApolloError, AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import { EmailService } from "../../service/EmailService";
import MeetService from "../../service/MeetService";
import { Meet, MeetType, PrivateUser, PublicUser, Resolvers } from "../../types/gqlGeneratedTypes";
import MeetResolverValidator from "../../validator/MeetResolverValidator";
import config from "../../util/config";
import MeetRegistrationDao from "../../dao/MeetRegistrationDao";
import MeetDao from "../../dao/MeetDao";
import UserDao from "../../dao/UserDao";
import ScheduledEmailDao from "../../dao/ScheduledEmailDao";
import { EmailTemplateName } from "../../types/ScheduledEmail";
import { getISOString } from "../../util/timeUtils";
const { disableNewMeetReminders, disableRegistrationEmail } = config;

// TODO: remove unused params
const meetResolver = (
  meetResolverValidator: MeetResolverValidator,
  meetService: MeetService,
  meetRegistrationDao: MeetRegistrationDao,
  userDao: UserDao,
  emailService: EmailService,
  meetDao: MeetDao,
  scheduledEmailDao: ScheduledEmailDao,
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

        return meetResolverValidator
          .addOne(args, context)
          .then((input) => meetDao.addOne(input))
          .then(async (meet) => {
            // queue meet reminders (unless disabled)
            if (disableNewMeetReminders) {
              return meet;
            }

            const meetId = meet.id;

            const isHackathon = meet.meetType === MeetType.Hackathon; // WORKSHOPS templates cover meet types: WORKSHOP, WEBINAR, LECTURE
            const templates = {
              reminder1: isHackathon ? EmailTemplateName.HACKATHONS_REMINDER_1 : EmailTemplateName.WORKSHOPS_REMINDER_1,
              reminder2: isHackathon ? EmailTemplateName.HACKATHONS_REMINDER_2 : EmailTemplateName.WORKSHOPS_REMINDER_2,
            };
            // TODO: Move email queuing to service layer
            // queue reminder 1, only if current time is before timing of reminder 1
            try {
              const reminder1Timing = getISOString({
                targetWallclock: meet.startTime,
                targetRegion: meet.region,
                offset: { days: -1 },
              });

              const reminder1Time = new Date(reminder1Timing).getTime();

              const nowTime = new Date().getTime();

              if (nowTime < reminder1Time) {
                await scheduledEmailDao.queue({
                  templateName: templates.reminder1,
                  meetRecipientId: meetId,
                  meetId,
                  sendAt: reminder1Timing,
                });
              }
            } catch (e) {
              console.error(`Failed to queue email [reminder 1] for meet with id ${meetId}`, e);
            }

            // queue reminder 2 - 30 mins before meet starts
            try {
              const reminder2Timing = getISOString({
                targetWallclock: meet.startTime,
                targetRegion: meet.region,
                offset: { minutes: -30 },
              });
              await scheduledEmailDao.queue({
                templateName: templates.reminder2,
                meetRecipientId: meetId,
                meetId,
                sendAt: reminder2Timing,
              });
            } catch (e) {
              console.error(`Failed to queue email [reminder 2] for meet with id ${meetId}`, e);
            }
            return meet;
          });
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
          .then(({ meetId }) => meetRegistrationDao.addOne({ userId, meetId }))
          .then(async ({ userId, meetId, id }) => {
            if (disableRegistrationEmail) {
              return true;
            }
            // Try sending confirmatoin email
            try {
              const meet = await meetDao.getOne({ id: meetId });
              if (!meet) throw `Meet with id ${meetId} failed fetch`;
              const isHackathon = meet.meetType === MeetType.Hackathon; // WORKSHOPS templates cover meet types: WORKSHOP, WEBINAR, LECTURE

              const template = isHackathon
                ? EmailTemplateName.HACKATHONS_REGISTRATION_CONFIRMATION
                : EmailTemplateName.WORKSHOPS_REGISTRATION_CONFIRMATION;

              // TODO: Move email queuing to service layer
              // queue confirmation email for immediate sending
              try {
                await scheduledEmailDao.queue({
                  templateName: template,
                  userRecipientId: userId,
                  meetId,
                });
              } catch (e) {
                console.log(`Failed to queue meet registration confirmation for meet registration with id: ${id}`);
              }
            } catch (e) {
              console.error(
                `Error when queueing registration confirmation email of userId: ${userId} for meetId: ${meetId}`,
                e,
              );
            }

            return;
          })
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
