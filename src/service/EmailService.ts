import config from "../util/config";
import { EmailDao } from "../dao/EmailDao";
import { Email } from "../types/Email";
import { Meet } from "../types/gqlGeneratedTypes";
import { generateIcsAttachments } from "../util/emailUtils";

const { senderEmail } = config;
export class EmailService {
  constructor(private emailDao: EmailDao) {}

  generateMeetReminderEmail(recipientEmailAddress: string, meet: Meet): Email {
    const { title, description } = meet;
    const email: Email = {
      to: recipientEmailAddress,
      from: senderEmail,
      subject: `Reminder: ${title} is coming up!`,
      html: `<h1>Reminder for <strong>${title}</strong><h1>`,
    };

    return email;
  }

  generateMeetInvitationEmail(recipientEmailAddress: string, meet: Meet): Email {
    const { title, description } = meet;
    const email: Email = {
      to: recipientEmailAddress,
      from: senderEmail,
      subject: `Invitation: ${title}`,
      html: `<h1>Invitation for <strong>${title}</strong><h1>`,
      attachments: generateIcsAttachments(meet),
    };

    return email;
  }

  async sendEmail(email: Email): Promise<boolean> {
    return this.emailDao.sendEmail(email);
  }
}
