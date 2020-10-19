import sgMail from "@sendgrid/mail";
import Knex from "knex";
import { Email, ScheduledEmail } from "../types/Email";

export class EmailDao {
  constructor(private apiKey: string, private knex: Knex) {}

  async queue(scheduledEmailVars: ScheduledEmail): Promise<void> {
    throw new Error("Not yet implemented");
  }

  async deleteScheduledEmail(id: string): Promise<void> {
    throw new Error("Not yet implemented");
  }

  async sendEmail(email: Email): Promise<boolean> {
    sgMail.setApiKey(this.apiKey);
    try {
      await sgMail.send(email);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
