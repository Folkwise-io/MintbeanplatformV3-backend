import { Email, ScheduledEmail } from "../types/Email";

export enum EmailResponseStatus {
  SUCCESS = "EMAIL_SUCCESS",
  REQUEST_ERROR = "EMAIL_REQUEST_ERROR",
  SERVER_ERROR = "EMAIL_SERVER_ERROR",
}

export interface EmailResponse {
  statusCode: number;
  status: EmailResponseStatus;
  errorMessage?: string;
}

export default interface EmailDao {
  /** Queues an email template to be sent (i.e. by persisting in a db) */
  queue(scheduledEmailVars: ScheduledEmail): Promise<void>;

  /** Retrieves scheduled emails that have not been sent */
  getUnsentScheduledEmails(): Promise<ScheduledEmail[]>;

  /** Retrieves overdue scheduled emails that should be sent right away */
  getOverdueScheduledEmails(): Promise<ScheduledEmail[]>;

  /** Deletes a queued email */
  deleteScheduledEmail(id: string): Promise<void>;

  /** Sends an email */
  sendEmail(email: Email): Promise<EmailResponse>;
}
