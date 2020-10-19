import { Email } from "../../types/Email";
import EmailService from "../../service/EmailService";
import { Meet, Resolvers } from "../../types/gqlGeneratedTypes";
import EmailResolverValidator from "../../validator/EmailResolverValidator";
import MeetService from "../../service/MeetService";
import { ServerContext } from "../../buildServerContext";
import { ensureExists } from "../../util/ensureExists";
import { User } from "../../types/User";
import ensureAdmin from "../../util/ensureAdmin";

const emailResolver = (
  emailResolverValidator: EmailResolverValidator,
  emailService: EmailService,
  meetService: MeetService,
): Resolvers => {
  return {
    Mutation: {
      //TODO: check yup validation of input in emailResolverValidator
      sendTestEmail: async (_root, { input }, context: ServerContext): Promise<boolean> => {
        ensureAdmin(context);
        const { subject, body } = input;
        const testEmail: Email = {
          to: "jimmy.peng@mintbean.io",
          from: "jimmy.peng@mintbean.io",
          subject: subject,
          html: body,
        };
        await emailService.sendEmail(testEmail).then((res) => {
          if (res.status === "SUCCESS") {
            return true;
          }
        });

        return false;
      },

      sendReminderEmailForMeet: async (_root, { input }, context: ServerContext): Promise<boolean> => {
        ensureAdmin(context);
        const { meetId, subject, body } = input;
        const meet = ensureExists<Meet>("Meet")(await meetService.getOne({ id: meetId }));
        // TODO: get users and map over their emails and send them all
        const email = emailService.generateMeetReminderEmail("jimmy.peng@mintbean.io", meet);

        await emailService.sendEmail(email).then((res) => {
          if (res.status === "SUCCESS") {
            return true;
          }
        });

        return false;
      },

      sendSampleRegistrationEmailForMeet: async (_root, args, context: ServerContext) => {
        ensureAdmin(context);

        const user: User = {
          id: "00000000-0000-0000-0000-000000000000",
          email: "jimmy.peng@mintbean.io",
          passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
          firstName: "Jimmy",
          lastName: "Peng",
          createdAt: "2019-10-15",
          updatedAt: "2019-10-15",
          isAdmin: false,
        };
        const meet = ensureExists<Meet>("Meet")(await meetService.getOne({ id: args.meetId }));
        const email = emailService.generateMeetRegistrationEmail(user, meet, "REGISTRATION_UUID_WILL_GO_HERE");
        await emailService.sendEmail(email).then((res) => {
          if (res.status === "SUCCESS") {
            return true;
          }
        });

        return false;
      },
    },
  };
};

export default emailResolver;
