import ics from "ics";
import { EmailDao } from "../dao/EmailDao";
import { Email } from "../types/Email";
import { Meet } from "../types/gqlGeneratedTypes";
import { EventAttributes } from "ics";

export class EmailService {
  constructor(private emailDao: EmailDao) {}

  generateMeetInvitationEmail(recipientEmailAddress: string, meet: Meet): Email {
    const email: Email = {
      to: recipientEmailAddress,
      from: "jimmy.peng@mintbean.io",
      subject: meet.title,
      html: `<h1>Invite for <strong>${meet.title}</strong><h1>`,
    };

    return email;
  }

  async sendEmail(email: Email): Promise<boolean> {
    return this.emailDao.sendEmail(email);
  }
}
