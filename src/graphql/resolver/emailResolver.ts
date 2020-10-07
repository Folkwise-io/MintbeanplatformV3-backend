import { Email } from "../../types/Email";
import { EmailService } from "../../service/EmailService";
import { Meet, Resolvers } from "../../types/gqlGeneratedTypes";
import EmailResolverValidator from "../../validator/EmailResolverValidator";
import MeetService from "../../service/MeetService";
import { ServerContext } from "../../buildServerContext";
import { ensureExists } from "../../util/ensureExists";
import { generateJsonLdHtmlFromMeet } from "../../util/emailUtils";

const emailResolver = (
  emailResolverValidator: EmailResolverValidator,
  emailService: EmailService,
  meetService: MeetService,
): Resolvers => {
  return {
    Mutation: {
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

      sendSampleInvitationForMeet: async (_root, args, context: ServerContext) => {
        const meet = ensureExists<Meet>("Meet")(await meetService.getOne({ id: args.meetId }));
        const email = emailService.generateMeetInvitationEmail("jimmy.peng@mintbean.io", meet);
        return emailService.sendEmail(email);
      },
    },
  };
};

export default emailResolver;
