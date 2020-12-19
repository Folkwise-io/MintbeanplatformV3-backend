import { EmailResponse, SendContactFormEmailInput } from "../types/gqlGeneratedTypes";
import { Email } from "../types/ScheduledEmail";

// TODO: move this Dao to jobs world
export default interface EmailApiDao {
  /**
   *
   * @param email - The email instructions for sendgrid
   */
  send(email: Email): Promise<EmailResponse>;
  /** For sending contact form messages as requrested by frontend. Recipients are hard-wired via environment variables */
  sendContactFormEmail(input: SendContactFormEmailInput): Promise<EmailResponse>;
}
