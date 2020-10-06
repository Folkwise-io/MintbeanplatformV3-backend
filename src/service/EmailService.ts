import { EmailDao } from "../dao/EmailDao";
import { Email } from "../types/Email";
import { Meet } from "../types/gqlGeneratedTypes";
import { generateIcsFileInBase64, mapMeetToIcsEventAttributes } from "../util/emailUtils";

export class EmailService {
  constructor(private emailDao: EmailDao) {}

  generateMeetInvitationEmail(recipientEmailAddress: string, meet: Meet): Email {
    const icsEventAttributes = mapMeetToIcsEventAttributes(meet);
    const icsFile = generateIcsFileInBase64(icsEventAttributes);

    const email: Email = {
      to: recipientEmailAddress,
      from: "jimmy.peng@mintbean.io",
      subject: meet.title,
      html: `<h1>Invite for <strong>${meet.title}</strong><h1>`,
      attachments: [
        {
          content: icsFile,
          filename: "invite.ics",
          type: "application/calendar",
          disposition: "attachment",
        },
      ],
    };

    return email;
  }

  async sendEmail(email: Email): Promise<boolean> {
    return this.emailDao.sendEmail(email);
  }
}
