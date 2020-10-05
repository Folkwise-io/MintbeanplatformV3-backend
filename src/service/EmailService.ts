import { EmailDao } from "../dao/EmailDao";
import { Meet } from "../types/gqlGeneratedTypes";

export class EmailService {
  constructor(private emailDao: EmailDao) {}

  async sendInvite(recipient: string, event: Meet): Promise<void> {
    const sendGridEmailObject = {
      to: recipient,
      from: "jimmy.peng@mintbean.io",
      subject: event.title,
      html: `<h1>Invite for <strong>${event.title}</strong><h1>`,
    };

    return this.emailDao.sendEmail(sendGridEmailObject);
  }
}
