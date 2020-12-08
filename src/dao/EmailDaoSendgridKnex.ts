import Knex from "knex";
import sgMail from "@sendgrid/mail";
import { Email, EmailResponse, EmailResponseStatus, ScheduledEmail, ScheduledEmailInput } from "../types/Email";
import config from "../util/config";
import EmailDao from "./EmailDao";
import handleDatabaseError from "../util/handleDatabaseError";

const { SUCCESS, REQUEST_ERROR, SERVER_ERROR } = EmailResponseStatus;
const { sendgridKey } = config;
sgMail.setApiKey(sendgridKey);

export default class EmailDaoSendgridKnex implements EmailDao {
  constructor(private knex: Knex) {}

  // TODO: Add try catch to queue to fail silently
  // TODO: Manually test a bad apple email in the queue batch
  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void> {
    return handleDatabaseError(async () => {
      this.knex<ScheduledEmail>("scheduledEmails").insert(scheduledEmail);
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

  // TODO: Manually test a bad apple email in the send batch
  // TOOD: make it clear that we are failing silently (intentionally) in partial fail case

  async sendEmail(email: Email): Promise<EmailResponse> {
    try {
      const [res] = await sgMail.send(email);
      return { statusCode: res.statusCode, status: SUCCESS };
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));

      return {
        statusCode: e.code || 400,
        // Sendgrid e codes: https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/errors.html
        status: e?.code < 500 ? REQUEST_ERROR : SERVER_ERROR,
        errorMessage: e?.response?.body?.errors[0]?.message || "Unknown error",
      };
    }
  }

  // Actually deletes record from DB - does not archive it
  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("scheduledEmails").where({ id }).del();
      return true;
    });
  }
}
