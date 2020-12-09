import Knex from "knex";
import {
  Email,
  EmailResponse,
  EmailResponseStatus,
  ScheduledEmail,
  ScheduledEmailInput,
  ScheduledEmailResponse,
} from "../types/Email";
import config from "../util/config";
import EmailDao from "./EmailDao";
import handleDatabaseError from "../util/handleDatabaseError";

// TODO: rename to SheduleEmailDao
export default class EmailDaoSendgridKnex implements EmailDao {
  constructor(private knex: Knex) {}

  // TODO: Add try catch to queue to fail silently
  // TODO: Manually test a bad apple email in the queue batch
  async queue(scheduledEmails: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void> {
    return handleDatabaseError(async () => {
      await this.knex("scheduledEmails").insert(scheduledEmails).returning("*");
    });
  }

  getOverdueScheduledEmails(): Promise<ScheduledEmail[]> {
    const now = new Date();

    return handleDatabaseError(() => {
      return this.knex<ScheduledEmail>("scheduledEmails")
        .where({ sent: false })
        .andWhere("sendAt", "<=", now)
        .orderBy("sendAt");
    });
  }

  markAsSent(id: string): Promise<void> {
    return handleDatabaseError(async () => {
      await this.knex<ScheduledEmail>("scheduledEmails").update({ sent: true }).where({ id });
    });
  }

  getRecipients(id: string): Promise<string[]> {
    return handleDatabaseError(async () => {
      const scheduledEmails = (await this.knex<ScheduledEmail>("scheduledEmails").select(
        "userRecipientId",
        "meetRecipientIds",
      )) as ScheduledEmail[];
      const scheduledEmail = scheduledEmails[0];
      const { userRecipientId, meetRecipientIds } = scheduledEmail;
      // Note: userRecipientId is currently singular but in future may become a serialized array like meetRecipientIds. Once that change is made, concat all recipient ids from all recipient columns and return that array
      // For now, returning singular recipient as an array if specified.
      if (userRecipientId) {
        return [userRecipientId];
      } else {
        return meetRecipientIds || [];
      }
    });
  }

  // Actually deletes record from DB - does not archive it
  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("scheduledEmails").where({ id }).del();
      return true;
    });
  }
}
