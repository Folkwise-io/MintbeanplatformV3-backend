import sgMail from "@sendgrid/mail";
interface EmailClientOptions {
  apiKey: string;
  originEmail?: string;
}

interface Email {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export class EmailDao {
  constructor(private apiKey: string) {}

  async sendEmail(email: Email): Promise<void> {
    sgMail.setApiKey(this.apiKey);
    await sgMail.send(email);
  }
}
