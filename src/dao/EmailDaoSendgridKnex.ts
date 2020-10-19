import Knex from "knex";
import { Email, ScheduledEmail } from "../types/Email";
import sgMail from "@sendgrid/mail";
import config from "../util/config";
import EmailDao, { EmailResponse, EmailResponseStatus } from "./EmailDao";
import handleDatabaseError from "../util/handleDatabaseError";

const { SUCCESS, REQUEST_ERROR, SERVER_ERROR } = EmailResponseStatus;
const { sendgridKey } = config;
sgMail.setApiKey(sendgridKey);

export default class EmailDaoSendgridKnex implements EmailDao {
  constructor(private knex: Knex) {}

  queue(scheduledEmailVars: ScheduledEmail): Promise<void> {
    return handleDatabaseError(() => {
      return this.knex<ScheduledEmail>("scheduledEmails").insert(scheduledEmailVars);
    });
  }

  deleteScheduledEmail(id: string): Promise<void> {
    return handleDatabaseError(() => {
      return this.knex<ScheduledEmail>("scheduledEmails").update({ sent: true }).where({ id });
    });
  }

  sendEmail(email: Email): Promise<EmailResponse> {
    return sgMail.send(email).then(
      ([res, _]) => ({ statusCode: res.statusCode, status: SUCCESS }),

      (error) => {
        console.log(JSON.stringify(error, null, 2));
        return {
          statusCode: error.code || 400,
          // Sendgrid error codes: https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/errors.html
          status: error?.code < 500 ? REQUEST_ERROR : SERVER_ERROR,
          errorMessage: error?.response?.body?.errors[0]?.message || "Unknown error",
        };
      },
    );
  }
}
