import config from "../../util/config";
import EmailDao from "../../dao/EmailDao";
import { Email, EmailResponse } from "../../types/Email";
import { Meet } from "../../types/gqlGeneratedTypes";
import { generateIcsAttachments, generateJsonLdHtml } from "../../util/emailUtils";
import { User } from "../../types/User";

const { senderEmail } = config;
export default class EmailService {
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

  generateMeetRegistrationEmail(user: User, meet: Meet, registrationId: string): Email {
    const { title, description } = meet;
    const email: Email = {
      to: user.email,
      from: senderEmail,
      subject: `Registration Confirmation for ${title}`,
      html: generateJsonLdHtml(user, meet, registrationId),
      attachments: generateIcsAttachments(meet),
    };

    return email;
  }

  async sendEmail(email: Email): Promise<EmailResponse> {
    return this.emailDao.sendEmail(email);
  }
}
