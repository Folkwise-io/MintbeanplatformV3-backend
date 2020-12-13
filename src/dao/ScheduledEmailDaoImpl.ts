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
      const pluckedRetries: number[] = await this.knex("scheduledEmails").where({ id }).pluck("retriesLeft");
      if (!pluckedRetries.length) {
        throw new Error(`Error when retrieving scheduled email retries. No scheduled email with id ${id} found.`);
      }
      return pluckedRetries[0];
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
      const pluckedRetries: number[] = await this.knex("scheduledEmails").where({ id }).pluck("retriesLeft");
      if (!pluckedRetries.length) {
        throw new Error(`Error when decrementing scheduled email retries. No scheduled email with id ${id} found.`);
      }

      let retriesLeft = pluckedRetries[0];
      if (retriesLeft <= 0) return 0; // guard to correct any bad data

      retriesLeft -= 1;
      const rawRecords = await this.knex<ScheduledEmailRaw>("scheduledEmails")
        .where({ id })
        .update({ retriesLeft })
        .returning("*");
      return rawRecords[0].retriesLeft;
    });
  }
}
