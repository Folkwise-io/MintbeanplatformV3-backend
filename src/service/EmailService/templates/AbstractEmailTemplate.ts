import { Email, EmailTemplate, EmailVars } from "../../../types/Email";

export default abstract class AbstractEmailTemplate implements EmailTemplate {
  abstract queue(emailVars: EmailVars): Promise<void>;
  abstract generateEmail(emailVars: EmailVars): Email;
  send(email: Email): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
