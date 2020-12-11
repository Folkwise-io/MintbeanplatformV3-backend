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
import UserService from "./UserService";

const { senderEmail } = config;

type EmailContext = {
  scheduledEmailId: string;
  type: "SUCCESS";
  templateName: string;
  recipients: User[];
  meet?: Meet;
};

interface BuildErrorParams {
  scheduledEmailId: string;
  message: string;
  jsError?: any;
}
const logError = (params: BuildErrorParams): void => {
  const { jsError, scheduledEmailId, message } = params;

  let errorText: string = message;

  if (scheduledEmailId) {
    errorText += `... The scheduledEmail.id was [${scheduledEmailId}]`;
  }

  if (jsError) {
    console.error(errorText, jsError);
  } else {
    console.error(errorText);
  }
};

export class EmailService {
  constructor(
    private emailDao: EmailDao, // TODO: remove when removing old email system
    private scheduledEmailDao: ScheduledEmailDao,
    private userDao: UserDao,
    private meetDao: MeetDao,
  ) {}

  async getEmailsToBeSent(): Promise<EmailContext[]> {
    let records;
    try {
      records = await this.scheduledEmailDao.getOverdueScheduledEmails();
    } catch (e) {
      logError({
        scheduledEmailId: "N/A",
        message: "Failed to get emails to be sent from the database. See JS Error.",
        jsError: e,
      });
      return [];
    }

    const emailContextPromises: Promise<EmailContext>[] = records.map(
      async ({ id, userRecipientId, meetRecipientId, templateName, meetId }): Promise<EmailContext> => {
        try {
          let recipients: User[] = [];
          let meet: Meet | undefined;

          if (meetRecipientId) {
            recipients = await this.userDao.getMany({ meetId: meetRecipientId });
          } else if (userRecipientId) {
            const user = await this.userDao.getOne({ id: userRecipientId });
            recipients = user ? [user] : [];
          } else {
            throw new Error("scheduledEmail Record did not have meetRecipientId or userReceipientId.");
          }

          if (meetId) {
            meet = await this.meetDao.getOne({ id: meetId });
          }

          return {
            type: "SUCCESS",
            scheduledEmailId: id,
            templateName,
            recipients,
            meet,
          };
        } catch (e) {
          const errObj: BuildErrorParams = {
            scheduledEmailId: id,
            message: "Unexpected JavaScript exception. See stack trace.",
            jsError: e,
          };

          throw errObj;
        }
      },
    );

    const settledResults = await Promise.allSettled(emailContextPromises);

    const rejects: PromiseRejectedResult[] = <PromiseRejectedResult[]>(
      settledResults.filter((x) => x.status === "rejected")
    );
    rejects.map((rejectedPromise: PromiseRejectedResult) => {
      const reason = rejectedPromise.reason as BuildErrorParams;
      logError(reason);
    });

    const fulfilleds: PromiseFulfilledResult<EmailContext>[] = <PromiseFulfilledResult<EmailContext>[]>(
      settledResults.filter((x) => x.status === "fulfilled")
    );

    return fulfilleds.map((x) => x.value);
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
