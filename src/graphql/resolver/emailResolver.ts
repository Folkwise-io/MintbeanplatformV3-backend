import { EmailResponse, Resolvers } from "../../types/gqlGeneratedTypes";
import EmailApiDao from "../../dao/EmailApiDao";
import { ServerContext } from "../../buildServerContext";
import EmailResolverValidator from "../../validator/EmailResolverValidator";

const emailResolver = (emailResolverValidator: EmailResolverValidator, emailApiDao: EmailApiDao): Resolvers => {
  return {
    Mutation: {
      sendContactFormEmail: (_root, args, context: ServerContext): Promise<EmailResponse> => {
        return emailResolverValidator
          .sendContactFormEmail(args, context)
          .then((args) => emailApiDao.sendContactFormEmail(args.input));
      },
    },
  };
};

export default emailResolver;
