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

import { Meet } from "../../types/gqlGeneratedTypes";
import { User } from "../../types/User";
import { EmailCommander } from "./EmailCommander";
import { generateEmail, generateMeetIcsAttachments } from "../../util/emailUtils";

/** Email context should contain all inflated variables for all email templates. */
export interface EmailContext {
  recipient: User;
  meet?: Meet;
  emailAttachments?: Attachment[];
}

interface InflatableVars {
  recipientId: string;
  meetId?: string | null;
}

export default class EmailCommanderImpl implements EmailCommander {
  constructor(private emailDao: EmailDao, private userDao: UserDao, private meetDao: MeetDao) {}

  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void> {
    return this.emailDao.queue(scheduledEmail);
  }

  getOverdueScheduledEmails(): Promise<ScheduledEmail[]> {
    return this.emailDao.getOverdueScheduledEmails();
  }

  // Maybe this doesn't belong in EmailCommander but couldn't find another place for it as it relies on Dao context
  async buildEmailContext(templateName: EmailTemplateName, inflatableVars: InflatableVars): Promise<EmailContext> {
    const { recipientId, meetId } = inflatableVars;
    const { HACKATHON_REGISTRATION_CONFIRM, WORKSHOP_REGISTRATION_CONFIRM } = EmailTemplateName;

    // if error on fetching recipient, the email cannot be sent, so allow error to be thrown to be handled when context being built
    const recipient = (await this.userDao.getOne({ id: recipientId })) as User;

    // Below we are fetching optional variables, gracefully fail with log if entity not found.
    let meet = undefined;
    let emailAttachments: Attachment[] | undefined;

    if (meetId) {
      try {
        meet = await this.meetDao.getOne({ id: meetId });
      } catch (e) {
        console.log(e);
      }
    }
    // Build calendar invite attachments for appropriate templates
    if (meet) {
      if (templateName === HACKATHON_REGISTRATION_CONFIRM) {
        // Hackathon kickoff invites are duration 60mins from startTime
        emailAttachments = generateMeetIcsAttachments(meet, {
          duration: { minutes: 60 },
          title: `Kickoff for Mintbean Hackathon "${meet.title}"`,
        });
      } else if ((templateName = WORKSHOP_REGISTRATION_CONFIRM)) {
        emailAttachments = generateMeetIcsAttachments(meet, {
          title: `[Mintbean] "${meet.title}"`,
        });
      }
    }

    return {
      recipient,
      meet,
      emailAttachments,
    };
  }

  /**  Build and send emails for given scheduledEmail */
  async dispatch(scheduledEmail: ScheduledEmail): Promise<EmailResponse[]> {
    const { templateName, id, meetId } = scheduledEmail;

    // 1. [GET RECIPIENTS] for this scheduld email
    const recipientIds = await this.emailDao.getRecipients(id);

    // 2. [BUILD EMAILS] by mapping over recipients to build context and email promise for that recipient
    const emailPromises = recipientIds.map(async (recipientId) => {
      // TODO: does this need try/catch to handle errors from context building phase?

      // const context = await this.buildEmailContext(templateName, { recipientId, meetId });
      // const email = generateEmail(templateName, context);
      // return email;

      // TODO: remove below. temp only
      const fakeEmailForTesting = {
        to: "claire.froelich@gmail.com",
        from: "noreply@mintbean.io",
        title: "TEST EMAIL " + new Date(),
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
    const emailResponsePromises = successEmails.map(async (email) => await this.emailDao.sendEmail(id, email));
    // It is OK to use Promise.all here because emailDao#sendEmail gracefully handles failed sends
    const emailResponses = await Promise.all(emailResponsePromises);

    // 5. [RETURN EMAIL RESPONSES]
    return emailResponses;
  }
}
