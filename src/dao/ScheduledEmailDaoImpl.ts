import Knex from "knex";
import ScheduledEmailDao from "./ScheduledEmailDao";
import handleDatabaseError from "../util/handleDatabaseError";
import { ScheduledEmailInput, ScheduledEmailRaw } from "../types/ScheduledEmail";

export default class ScheduledEmailDaoImpl implements ScheduledEmailDao {
  constructor(private knex: Knex) {}

  async queue(input: ScheduledEmailInput): Promise<void> {
    handleDatabaseError(async () => {
      await this.knex("scheduledEmails").insert(input);
    });
  }

  getOverdueScheduledEmails(): Promise<ScheduledEmailRaw[]> {
    const now = new Date();

    return handleDatabaseError(async () => {
      return this.knex<ScheduledEmailRaw>("scheduledEmails").where("sendAt", "<=", now).orderBy("sendAt");
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("scheduledEmails")
        .where({ id })
        .del()
        // TODO: remove debugger callback.
        .asCallback((err: any) => {
          console.log(err);
        });
      return true;
    });
  }
}
