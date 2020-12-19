import { ServerContext } from "../buildServerContext";
import { MutationSendContactFormEmailArgs, SendContactFormEmailInput } from "../types/gqlGeneratedTypes";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { sendContactFormEmailInputSchema } from "./yupSchemas/email";

export default class EmailResolverValidator {
  constructor() {}

  async sendContactFormEmail(
    args: MutationSendContactFormEmailArgs,
    _context: ServerContext,
  ): Promise<MutationSendContactFormEmailArgs> {
    validateAgainstSchema<SendContactFormEmailInput>(sendContactFormEmailInputSchema, args.input);
    return args;
  }
}
