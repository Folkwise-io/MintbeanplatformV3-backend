import { ScheduledEmailInput, ScheduledEmailRaw } from "../types/ScheduledEmail";

export default interface ScheduledEmailDao {
  queue(input: ScheduledEmailInput): Promise<void>;
  getOverdueScheduledEmails(): Promise<ScheduledEmailRaw[]>;
  //** Warning: This REALLY deletes record from database. Does NOT archive with deleted: true flag. */
  deleteOne(id: string): Promise<boolean>;
}
