import { Email, EmailResponse, ScheduledEmail, ScheduledEmailInput } from "../types/Email";

export default interface EmailDao {
  /** Queues an email template to be sent (i.e. by persisting in a db) */
  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void>;

  /** Retrieves scheduled emails that have not been sent */
  getUnsentScheduledEmails(): Promise<ScheduledEmail[]>;

  /** Retrieves overdue scheduled emails that should be sent right away */
  getOverdueScheduledEmails(): Promise<ScheduledEmail[]>;

  /** Deletes a queued email */
  deleteScheduledEmail(id: string): Promise<void>;

  /** Sends an email */
  sendEmail(email: Email): Promise<EmailResponse>;

  /** For TestManager to call */
  deleteAll(): Promise<void>;
}
