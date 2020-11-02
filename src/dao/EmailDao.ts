import sgMail from "@sendgrid/mail";
import { Email } from "../types/Email";

export class EmailDao {
  constructor(private apiKey: string) {}

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
