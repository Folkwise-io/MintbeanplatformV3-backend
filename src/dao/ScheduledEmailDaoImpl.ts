import Knex from "knex";
import ScheduledEmailDao, { ScheduledEmailDaoGetOneArgs } from "./ScheduledEmailDao";
import handleDatabaseError from "../util/handleDatabaseError";
import { ScheduledEmailInput, ScheduledEmailRaw } from "../types/ScheduledEmail";

export default class ScheduledEmailDaoImpl implements ScheduledEmailDao {
  constructor(private knex: Knex) {}

  async queue(input: ScheduledEmailInput): Promise<void> {
    handleDatabaseError(async () => {
      await this.knex("scheduledEmails").insert(input);
    });
  }

  getEmailsToSend(): Promise<ScheduledEmailRaw[]> {
    const now = new Date();

    return handleDatabaseError(async () => {
      return this.knex<ScheduledEmailRaw>("scheduledEmails")
        .where("sendAt", "<=", now)
        .andWhere("retriesLeft", ">=", 1)
        .orderBy("sendAt");
    });
  }

  async getRetriesLeft(id: string): Promise<number> {
    return handleDatabaseError(async () => {
      const raws = await this.knex("scheduledEmails").select("retriesLeft").where({ id });
      return raws[0].retriesLeft;
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("scheduledEmails").where({ id }).del();
      return true;
    });
  }

  async decrementRetriesLeft(id: string): Promise<number> {
    return handleDatabaseError(async () => {
      let retriesLeft = (await this.knex("scheduledEmails").where({ id }).select("retriesLeft")) as number;
      if (retriesLeft <= 0) return 0; // corrects bad data

      retriesLeft -= 1;
      const raws = await this.knex<ScheduledEmailRaw>("scheduledEmails")
        .where({ id })
        .update({ retriesLeft })
        .returning("*");
      return raws[0].retriesLeft;
    });
  }
}
