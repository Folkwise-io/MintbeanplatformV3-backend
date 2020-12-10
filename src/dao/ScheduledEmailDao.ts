import { ScheduledEmail, ScheduledEmailInput } from "../types/Email";

export interface ScheduledEmailDaoSendInput {
  recipientUserId: string;
  meetId: string; // required for now until nullable use case arises.
}

export default interface ScheduledEmailDao {
  queue(input: ScheduledEmailInput): Promise<void>;
  getOverdueScheduledEmails(): Promise<ScheduledEmail[]>;
  //** Warning: This REALLY deletes record from database. Does NOT archive with deleted: true flag. */
  deleteOne(id: string): Promise<boolean>;
}
