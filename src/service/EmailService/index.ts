import config from "../../util/config";
import EmailDao from "../../dao/EmailDao";
import { Email, EmailResponse, EmailTemplateName, ScheduledEmailInput } from "../../types/Email";
import { Meet } from "../../types/gqlGeneratedTypes";
// import { generateIcsAttachments, generateJsonLdHtml } from "../../util/emailUtils";
import { User } from "../../types/User";
import { EmailCommander } from "./EmailCommander";
import email from "../../graphql/typedef/email";

const { senderEmail } = config;

type QueueImmediateTestEmailArgs = Omit<ScheduledEmailInput, "sendAt">;

// This service will be used for giving Admins custom emailing/preview abilities
export default class EmailService {
  constructor(private emailDao: EmailDao, private emailCommander: EmailCommander) {}

  // generateMeetReminderEmail(recipientEmailAddress: string, meet: Meet): Email {
  //   const { title, description } = meet;
  //   const email: Email = {
  //     to: recipientEmailAddress,
  //     from: senderEmail,
  //     subject: `Reminder: ${title} is coming up!`,
  //     html: `<h1>Reminder for <strong>${title}</strong><h1>`,
  //   };

  //   return email;
  // }

  // TODO: Remove this method, for development only. queues hackathon confirm email for immediate sending
  async queueTestEmail(): Promise<void> {
    const now = new Date().toISOString();
    const scheduledEmailInput = {
      userRecipientId: "00000000-0000-0000-0000-000000000000",
      templateName: EmailTemplateName.HACKATHON_REGISTRATION_CONFIRM,
    };
    return this.emailCommander.queue(scheduledEmailInput);
  }
}
