import EmailDao from "../../dao/EmailDao";
import MeetDao from "../../dao/MeetDao";
import UserDao from "../../dao/UserDao";
import {
  EmailTemplateName,
  ScheduledEmailInput,
  ScheduledEmail,
  EmailResponse,
  Attachment,
  Email,
} from "../../types/Email";

import { EmailCommander } from "./EmailCommander";
// import { generateEmail, generateMeetIcsAttachments } from "../../util/emailUtils";
import EmailContextBuilder from "./EmailContextBuilder";

export default class EmailCommanderImpl implements EmailCommander {
  constructor(private emailDao: EmailDao, private emailContextBuilder: EmailContextBuilder) {}

  async queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void> {
    return this.emailDao.queue(scheduledEmail);
  }

  async getOverdueScheduledEmails(): Promise<ScheduledEmail[]> {
    return this.emailDao.getOverdueScheduledEmails();
  }

  /**  Build and send emails for given scheduledEmail */
  async dispatch(scheduledEmail: ScheduledEmail): Promise<EmailResponse[]> {
    const { templateName, id, meetId } = scheduledEmail;

    // 1. [GET RECIPIENTS] for this scheduld email
    const recipientIds = await this.emailDao.getRecipients(id);

    // 2. [BUILD EMAILS] by mapping over recipients to build context and email promise for that recipient
    const emailPromises = recipientIds.map(async (recipientId) => {
      // TODO: does this need try/catch to handle errors from context building phase?

      // const context = this.emailContextBuilder.buildContext(templateName, { recipientId, meetId });
      // const email = generateEmail(templateName, context);
      // return email;

      // TODO: remove below. temp only
      const fakeEmailForTesting = {
        to: "claire.froelich@gmail.com",
        from: "noreply@mintbean.io",
        title: `TEST EMAIL template: ${templateName} ${new Date()}`,
        html: "test",
      };
      return fakeEmailForTesting;
    });

    // 3. [HANDLE EMAIL BUILDS]
    const emails = await Promise.allSettled(emailPromises);
    ////=> (case: build failed) log any emails that failed the build phase
    const failedEmailsPromiseResult = (emails.filter(
      (em) => em.status === "rejected",
    ) as unknown) as PromiseRejectedResult[];
    failedEmailsPromiseResult.forEach((failed) =>
      console.warn(`Email build failed for email in scheduledEmail: ${id}.\nReason: ${failed.reason}`),
    );
    ////=> (case: build successful) get successfully built emails for dispatch
    const successEmailsPromiseResult = (emails.filter(
      (em) => em.status === "fulfilled",
    ) as unknown) as PromiseFulfilledResult<Email>[];
    const successEmails = successEmailsPromiseResult.map((res) => res.value);

    // 4. [SEND EMAILS] and get responses
    const emailResponsePromises = successEmails.map(async (email) => await this.emailDao.sendScheduledEmail(id, email));
    // It is OK to use Promise.all here because emailDao#sendEmail gracefully handles failed sends
    const emailResponses = await Promise.all(emailResponsePromises);

    // 5. [RETURN EMAIL RESPONSES]
    return emailResponses;
  }
}
