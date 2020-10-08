import { Email } from "../../types/Email";
import { EmailService } from "../../service/EmailService";
import { Meet, Resolvers } from "../../types/gqlGeneratedTypes";
import EmailResolverValidator from "../../validator/EmailResolverValidator";
import MeetService from "../../service/MeetService";
import { ServerContext } from "../../buildServerContext";
import { ensureExists } from "../../util/ensureExists";
import { User } from "../../types/User";

const emailResolver = (
  emailResolverValidator: EmailResolverValidator,
  emailService: EmailService,
  meetService: MeetService,
): Resolvers => {
  return {
    Mutation: {
      //TODO: check if admin for all these routes
      //TODO: check yup validation of input in emailResolverValidator
      sendTestEmail: (_root, { input }, context: ServerContext): Promise<boolean> => {
        const { subject, body } = input;
        const testEmail: Email = {
          to: "jimmy.peng@mintbean.io",
          from: "jimmy.peng@mintbean.io",
          subject: subject,
          html: body,
        };
        return emailService.sendEmail(testEmail);
      },

      sendReminderEmailForMeet: async (_root, { input }, context: ServerContext) => {
        const meet = ensureExists<Meet>("Meet")(await meetService.getOne({ id: input.meetId }));
        const email = emailService.generateMeetReminderEmail("jimmy.peng@mintbean.io", meet);
        return emailService.sendEmail(email);
      },

      sendSampleRegistrationEmailForMeet: async (_root, args, context: ServerContext) => {
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
        const email = emailService.generateMeetRegistrationEmail(user, meet);
        return emailService.sendEmail(email);
      },
    },
  };
};

export default emailResolver;
