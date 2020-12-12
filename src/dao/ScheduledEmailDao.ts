import { ScheduledEmailInput, ScheduledEmailRaw } from "../types/ScheduledEmail";

export interface ScheduledEmailDaoGetOneArgs {
  id: string;
}

export default interface ScheduledEmailDao {
  queue(input: ScheduledEmailInput): Promise<void>;
  getEmailsToSend(): Promise<ScheduledEmailRaw[]>;
  getRetriesLeft(id: string): Promise<number>;
  //** Warning: This REALLY deletes record from database. Does NOT archive with deleted: true flag. */
  deleteOne(id: string): Promise<boolean>;
  decrementRetriesLeft(id: string): Promise<number>;
}
