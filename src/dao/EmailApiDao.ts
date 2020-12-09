//TODO: DAO for talking to sendgrid
import { Email, EmailResponse, ScheduledEmail, ScheduledEmailInput, ScheduledEmailResponse } from "../types/Email";

export default interface EmailApiDao {
  /** Sends an email */
  sendEmail(email: Email): Promise<EmailResponse>;
}
