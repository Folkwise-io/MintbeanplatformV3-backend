import { Email, EmailResponse, ScheduledEmail, ScheduledEmailInput } from "../types/Email";

export default interface EmailDao {
  /** Queues an email template to be sent (i.e. by persisting in a db) */
  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void>;

  /** Retrieves overdue scheduled emails that should be sent right away */
  getOverdueScheduledEmails(): Promise<ScheduledEmail[]>;

  /** Marks a scheduled email as sent */
  markAsSent(id: string): Promise<void>;

  /** Sends an email */
  sendEmail(email: Email): Promise<EmailResponse>;

  /** Deletes a scheduled email */
  deleteOne(id: string): Promise<boolean>;
}
