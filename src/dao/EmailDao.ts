import sgMail from "@sendgrid/mail";
import { Email, EmailTemplateName, EmailVars } from "../types/Email";

export class EmailDao {
  constructor(private apiKey: string) {}

  async queue(templateName: EmailTemplateName, emailVars: EmailVars): Promise<void> {
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
