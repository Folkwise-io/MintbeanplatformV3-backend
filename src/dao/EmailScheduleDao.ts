import { ScheduledEmail } from "../types/Email";

export interface ScheduledEmailDaoSendInput {
  recipientUserId: string;
  meetId: string; // required for now until nullable use case arises.
}

export default interface ScheduledEmailDao {
  queue(input: ScheduledEmailDaoSendInput): Promise<void>;
  getMany(): Promise<ScheduledEmail[]>;
  //** Warning: This REALLY deletes record from database. Does NOT archive with deleted: true flag. */
  deleteOne(id: string): Promise<boolean>;
}
