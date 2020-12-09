import { Email, EmailResponse, ScheduledEmail, ScheduledEmailInput, ScheduledEmailResponse } from "../types/Email";

export default interface EmailDao {
  /** Queues an email template to be sent (i.e. by persisting in a db) */
  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void>;

  /** Retrieves overdue scheduled emails that should be sent right away */
  getOverdueScheduledEmails(): Promise<ScheduledEmail[]>;

  /** Marks a scheduled email as sent */
  markAsSent(id: string): Promise<void>;

  /** Retrieves the userIds of all recipients for a given scheduled email */
  getRecipients(id: string): Promise<string[]>;

  /** Sends an email */
  sendEmail(email: Email): Promise<EmailResponse>;

  /** Sends a a scheduled email that persists the the scheduledEmailId in the response */
  sendScheduledEmail(id: string, email: Email): Promise<ScheduledEmailResponse>;

  /** Deletes a scheduled email */
  deleteOne(id: string): Promise<boolean>;
}
