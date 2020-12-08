import { ScheduledEmailInput, ScheduledEmail, EmailResponse } from "../../types/Email";

/** Queues email templates to the scheduledEmail db and coordinates sending of the email */
export interface EmailCommander {
  /** Adds the email as an entry to the scheduledEmails db, called upon triggering inside a controller or service */
  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void>;

  /** Retrieves overdue scheduled emails that should be sent right away */
  getOverdueScheduledEmails(): Promise<ScheduledEmail[]>;

  /** Called by the cron scheduler to coordinate generation/sending of emails. */
  dispatch(scheduledEmail: ScheduledEmail): Promise<EmailResponse[]>;
}
