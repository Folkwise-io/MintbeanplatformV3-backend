import Knex from "knex";
import { Email, ScheduledEmail } from "../types/Email";
import sgMail from "@sendgrid/mail";
import config from "../util/config";
const { sendgridKey } = config;
sgMail.setApiKey(sendgridKey);

export interface SendgridResponse {
  status: "SUCCESS" | "FAILURE";
}
export default class EmailDao {
  constructor(private knex: Knex) {}

  queue(scheduledEmailVars: ScheduledEmail): Promise<void> {
    throw new Error("Not yet implemented");
  }

  deleteScheduledEmail(id: string): Promise<void> {
    throw new Error("Not yet implemented");
  }

  async sendEmail(email: Email): Promise<SendgridResponse> {
    try {
      await sgMail.send(email);
      return { status: "SUCCESS" };
    } catch (e) {
      return { status: "FAILURE" };
    }
  }
}
