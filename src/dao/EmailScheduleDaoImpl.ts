import Knex from "knex";
import ScheduledEmailDao, { ScheduledEmailDaoSendInput } from "./EmailScheduleDao";
import handleDatabaseError from "../util/handleDatabaseError";
import { ScheduledEmail } from "../types/Email";

export default class ScheduledEmailDaoImpl implements ScheduledEmailDao {
  constructor(private knex: Knex) {}

  // TODO: filter for overdue emails (sendAt < now) and rename "getOverdueScheduledEmails"
  getMany(): Promise<ScheduledEmail[]> {
    return handleDatabaseError(async () => {
      return await this.knex("scheduledEmails").where({});
    });
  }

  async queue(input: ScheduledEmailDaoSendInput): Promise<void> {
    handleDatabaseError(async () => {
      await this.knex("scheduledEmails").insert(input);
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("scheduledEmails").where({ id }).del();
      return true;
    });
  }
}
