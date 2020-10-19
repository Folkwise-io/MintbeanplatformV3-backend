import Knex from "knex";
import { Email, ScheduledEmail } from "../types/Email";
import sgMail from "@sendgrid/mail";
import config from "../util/config";
const { sendgridKey } = config;
sgMail.setApiKey(sendgridKey);

export interface EmailResponse {
  statusCode: number;
  status: "SUCCESS" | "FAILURE";
  errorMessage?: string;
}

export default class EmailDao {
  constructor(private knex: Knex) {}

  queue(scheduledEmailVars: ScheduledEmail): Promise<void> {
    throw new Error("Not yet implemented");
  }

  deleteScheduledEmail(id: string): Promise<void> {
    throw new Error("Not yet implemented");
  }

  sendEmail(email: Email): Promise<EmailResponse> {
    return sgMail.send(email).then(
      ([res, _]) => ({ statusCode: res.statusCode, status: "SUCCESS" }),
      (error) => {
        console.log(JSON.stringify(error, null, 2));
        return {
          statusCode: error.code || 400,
          status: "FAILURE",
          errorMessage: error?.response?.body?.errors[0]?.message || "Unknown error",
        };
      },
    );
  }
}
