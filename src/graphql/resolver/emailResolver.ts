import { Email } from "../../types/Email";
import { EmailService } from "../../service/EmailService";
import { Resolvers } from "../../types/gqlGeneratedTypes";
import EmailResolverValidator from "../../validator/EmailResolverValidator";

const emailResolver = (emailResolverValidator: EmailResolverValidator, emailService: EmailService): Resolvers => {
  return {
    Mutation: {
      sendTestEmail: (): Promise<boolean> => {
        const testEmail: Email = {
          to: "jimmy.peng@mintbean.io",
          from: "jimmy.peng@mintbean.io",
          subject: "hi",
          html: "hi",
        };
        return emailService.sendEmail(testEmail);
      },
    },
  };
};

export default emailResolver;
