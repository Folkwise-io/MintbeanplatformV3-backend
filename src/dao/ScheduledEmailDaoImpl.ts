import Knex from "knex";
import ScheduledEmailDao, { ScheduledEmailDaoSendInput } from "./ScheduledEmailDao";
import handleDatabaseError from "../util/handleDatabaseError";
import { ScheduledEmail, ScheduledEmailInput } from "../types/Email";

export default class ScheduledEmailDaoImpl implements ScheduledEmailDao {
  constructor(private knex: Knex) {}

  //   export interface ScheduledEmailInput {
  //   templateName: EmailTemplateName;
  //   userRecipientId?: string | null;
  //   meetRecipientId?: string | null; // can get recipients via meet.registrants
  //   meetId?: string | null;
  //   sendAt?: string | null; // ISO string. defaults to now
  //   // in step 3:
  //   // icsStart: string | null; // nullable
  //   // icsDurationMins: number | null; //
  //   // icsEnd: string | null;
  // }

  async queue(input: ScheduledEmailInput): Promise<void> {
    handleDatabaseError(async () => {
      await this.knex("scheduledEmails").insert(input);
    });
  }

  // TODO: filter for overdue emails (sendAt < now) and rename "getOverdueScheduledEmails"
  getOverdueScheduledEmails(): Promise<ScheduledEmail[]> {
    return handleDatabaseError(async () => {
      return await this.knex("scheduledEmails").where({});
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("scheduledEmails").where({ id }).del();
      return true;
    });
  }
}
