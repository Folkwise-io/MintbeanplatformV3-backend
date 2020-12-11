import config from "../util/config";
import { EmailDao } from "../dao/EmailDao";
import { Email, ScheduledEmail } from "../types/ScheduledEmail";
import { Meet } from "../types/gqlGeneratedTypes";
import { generateIcsAttachments, generateJsonLdHtml } from "../util/emailUtils";
import { User } from "../types/User";
import ScheduledEmailDao from "../dao/ScheduledEmailDao";
import MeetDao from "../dao/MeetDao";
import UserDao from "../dao/UserDao";
import { rejects } from "assert";

const { senderEmail } = config;

export class EmailService {
  constructor(
    private emailDao: EmailDao, // TODO: remove when removing old email system
    private scheduledEmailDao: ScheduledEmailDao,
    private userDao: UserDao,
    private meetDao: MeetDao,
  ) {}

  async getOverdueScheduledEmails(): Promise<ScheduledEmail[]> {
    const rawScheduledEmails = await this.scheduledEmailDao.getOverdueScheduledEmails();
    if (!rawScheduledEmails.length) return [];

    // inflate vars, gracefull fail all inflates except recipients. Those should log errors
    const allInflatedPromises = rawScheduledEmails.map((raw) => {
      return new Promise<ScheduledEmail>(async (resolve, reject) => {
        // if no recipient(s) specified, log error and set this scheduled email to be omitted from return by flagging 'false'
        const hasNoRecipients = !raw.userRecipientId && !raw.meetRecipientId;
        if (hasNoRecipients) {
          // console.warn("No recipient(s) specified in this scheduled email. ", JSON.stringify(raw, null, "\t"));
          // return false;
          reject("No recipient(s) specified in this scheduled email. " + JSON.stringify(raw, null, "\t"));
        }
        const { userRecipientId, meetRecipientId, meetId } = raw;

        // Resolve recipients
        let recipients: User[] = [];
        // meetRecipient takes precedence
        if (!!meetRecipientId) {
          try {
            recipients = await this.userDao.getMany({ meetId: meetRecipientId });
          } catch (e) {
            // console.warn("Could not resolve meet recipients for scheduled email: ", JSON.stringify(raw, null, "\t"));
            // return false;
            reject("Could not resolve meet recipients for scheduled email: " + JSON.stringify(raw, null, "\t"));
          }
        }
        // for now only two recipient columns in db, so else block will handle userRecipientId
        else {
          try {
            const recipient = await this.userDao.getOne({ id: userRecipientId });
            if (recipient) {
              recipients = [recipient];
            } else {
              // console.warn("Could not resolve user recipient for scheduled email: ", JSON.stringify(raw, null, "\t"));
              // return false;
              reject("Could not resolve meet recipients for scheduled email: " + JSON.stringify(raw, null, "\t"));
            }
          } catch (e) {
            // console.warn("Could not resolve user recipient for scheduled email: ", JSON.stringify(raw, null, "\t"));
            // return false;
            reject("Could not resolve user recipient for scheduled email: " + JSON.stringify(raw, null, "\t"));
          }
        }
        let meet: Meet | null = null;
        if (meetId) {
          try {
            meet = (await this.meetDao.getOne({ id: meetId })) || null;
          } catch (e) {
            console.warn("Error attempting to inflate meet for scheduled email: ", JSON.stringify(raw, null, "\t"));
          }
        }
        return resolve({
          id: raw.id,
          templateName: raw.templateName,
          recipients,
          meet,
        });
      });
    });

    const promisesSettled = await Promise.allSettled<ScheduledEmail>(allInflatedPromises);
    // filter out non-truthy items
    const validScheduledEmails = (allInflated.filter((item) => !!item) as unknown) as ScheduledEmail[];
    return validScheduledEmails;
  }

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
