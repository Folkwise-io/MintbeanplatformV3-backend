import EmailDao from "../../dao/EmailDao";
import MeetDao from "../../dao/MeetDao";
import UserDao from "../../dao/UserDao";
import { EmailTemplateName, ScheduledEmailInput, ScheduledEmail, EmailResponse, Attachment } from "../../types/Email";

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

  async dispatch(scheduledEmail: ScheduledEmail): Promise<EmailResponse[]> {
    const { templateName, id, meetId } = scheduledEmail;

    // 1. define recipients Ids
    const recipientIds = await this.emailDao.getRecipients(id);

    // 2. map over recipients to build context and email promise for that recipient
    const emailPromises = recipientIds.map(async (recipientId) => {
      const context = await this.buildEmailContext(templateName, { recipientId, meetId });
      const email = generateEmail(templateName, context);
      return email;
    });

    const emails = await Promise.allSettled(emailPromises);

    // 3. await send of all emails
    const emailResponsePromises = emails.map(async (email) => await this.emailDao.sendEmail(id, email));

    // // LOG ALL FAILURES (id, reason, recipient, time)
    // // SUCCESS: delete scheduledEmail if sent (ignore invalid recipient emails for bulk)
    // return template
    //   .inflateVars(scheduledEmail)
    //   .then(template.generateEmails)
    //   .then((emails) => emails.map(this.emailDao.sendEmail))
    //   .then((emailResponsePromises) => Promise.all(emailResponsePromises))
    //   .then(async (emailResponses) => {
    //     // TODO: write logic that checks emailResponses to decide when to delete the scheduled email from entry
    //     await this.emailDao.markAsSent(id);
    //     return emailResponses;
    //   });
  }
}

// Q: Now we need to delete the scheduledEmail entry, is it better to do it here or in cron scheduler?
/* Q: How to decide for when to delete the entry? (i.e. wrong email address vs. sendgrid servers are down).
I think sendgrid server errors (500 codes) = don't delete, request errors like wrong email (400 codes) = delete */
// console.log({ emailResponses });
// const successes = (emailResponses.filter(
//   (x) => x.status === "fulfilled",
// ) as unknown) as PromiseFulfilledResult<EmailResponse>[];
// const failures = (emailResponses.filter((x) => x.status === "rejected") as unknown) as PromiseRejectedResult[];

// failures.forEach((failure) => console.log(failure.reason));

// const deletePromises = successes.map((x) => new Promise(this.emailDao.deleteOne(x.id)));
// const deleteResults = ((await Promise.allSettled(
//   deletePromises,
// )) as unknown) as PromiseSettledResult<EmailResponse>[];

// const deleteFailures = deleteResults.filter((x) => x.status === "rejected") as PromiseRejectedResult[];

// deleteFailures.forEach((failure) => console.log(failure.reason));
