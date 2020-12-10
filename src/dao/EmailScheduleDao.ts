import { ScheduledEmail } from "../types/Email";

export interface EmailScheduleDaoSendInput {
  recipientUserId: string;
  meetId: string; // required for now until nullable use case arises.
}

export default interface EmailScheduleDao {
  queue(input: EmailScheduleDaoSendInput): Promise<void>;
  getMany(): Promise<ScheduledEmail[]>;
  //** Warning: This REALLY deletes record from database. Does NOT archive with deleted: true flag. */
  deleteOne(id: string): Promise<boolean>;
}
