import config from "../util/config";
import { EmailDao } from "../dao/EmailDao";
import { Email, EmailResponse } from "../types/Email";
import { Meet } from "../types/gqlGeneratedTypes";
import { generateIcsAttachments, generateJsonLdHtml } from "../util/emailUtils";
import { User } from "../types/User";
import ScheduledEmailDao from "../dao/EmailScheduleDao";

interface EmailResponseWithScheduledEmailId extends EmailResponse {
  scheduledEmailId: string;
}
const { senderEmail } = config;
export class EmailService {
  constructor(
    private emailDao: EmailDao, // TODO: remove when removing old email system
    private emailScheduleDao: ScheduledEmailDao,
  ) {}

  // // TODO: change to overdue scheduled emails once endAt column added to db
  // // should this be broken down into service for sending individual scheduledEmail records? Bulk is nice because of Promise.all
  // async sendScheduledEmails(): Promise<void> {
  //   // fetch scheduled email
  //   const scheduledEmails = await this.emailScheduleDao.getMany();
  //   if (!scheduledEmails) return;

  //   const emailsWithScheduledEmailId = scheduledEmails.map((se) => {
  //     return {
  //       scheduledEmailId: se.id,
  //       // TODO: use buildEmail to build templated email
  //       email: {
  //         to: "claire.froelich@gmail.com",
  //         from: "noreply@mintbean.io",
  //         subject: "TODO - template" + new Date().toISOString(),
  //         html: "TODO - template",
  //       },
  //     };
  //   });

  //   const emailsWithScheduledEmailIdPromises = emailsWithScheduledEmailId.map(({ scheduledEmailId, email }) => {
  //     return new Promise<EmailResponseWithScheduledEmailId>(async (resolve, reject) => {
  //       // No try/catch here because emailApiDao gracefully handles failed email sends

  //       const emailResponse = await this.emailApiDao.send(email);
  //       // const [response] = await mockSgMailSend(email);

  //       const emailResponseWithScheduledEmailId = {
  //         ...emailResponse,
  //         scheduledEmailId,
  //       };

  //       if (emailResponse.status === EmailResponseStatus.SUCCESS) {
  //         resolve(emailResponseWithScheduledEmailId);
  //       } else {
  //         reject(emailResponseWithScheduledEmailId);
  //       }
  //     });
  //   });

  //   const promises = await Promise.allSettled(emailsWithScheduledEmailIdPromises);
  //   promises.forEach(async (promise) => {
  //     if (promise.status === "rejected") {
  //       console.warn(`EMAIL SEND FAILED`);
  //       console.warn(promise.reason);
  //     } else {
  //       // TOOD: Remove logging of success cases. Debugging only
  //       console.log("EMAIL SEND SUCCESS");
  //       console.log(promise.value);
  //       // Delete successfully sent scheduled emails (note: this works because scheduled emails are currently 1:1 with recipient)
  //       const { scheduledEmailId: id } = promise.value;
  //       try {
  //         await this.emailScheduleDao.deleteOne(id);
  //       } catch (e) {
  //         console.log("Failed to delete sent scheduled email. ", e);
  //       }
  //     }
  //   });
  // }
  // // TODO
  // buildEmail(templateName, emailContext: EmailContext): Email {
  //   // 1. template subject + body based on template name and vars
  //   // 2. determine
  // }

  // TODO: remove these three methods below. They belong to old email system
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

  async sendEmail(email: Email): Promise<boolean> {
    return this.emailDao.sendEmail(email);
  }
}
