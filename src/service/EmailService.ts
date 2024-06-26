import { Attachment, EmailTemplateName } from "../types/ScheduledEmail";
import { Meet } from "../types/gqlGeneratedTypes";
import { generateMeetIcsAttachments } from "../util/emailUtils";
import { User } from "../types/User";
import ScheduledEmailDao from "../dao/ScheduledEmailDao";
import MeetDao from "../dao/MeetDao";
import UserDao from "../dao/UserDao";

import { templateExists } from "../jobs/ScheduledEmailJob/templateUtil";

const { HACKATHONS_REGISTRATION_CONFIRMATION, WORKSHOPS_REGISTRATION_CONFIRMATION } = EmailTemplateName;

/** _prefixed properties are meta data not used as interpolation vars in templating */
export interface EmailContext {
  _scheduledEmailId: string;
  _isBulk: boolean; // true if scheduled email has multiple recipients
  _type: "SUCCESS";
  _templateName: string;
  _attachments: Attachment[];
  recipients: User[];
  meet?: Meet;
}

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
    console.error("There was an error", errorText, jsError);
  } else {
    console.error("There was an error", errorText);
  }
};

export default class EmailService {
  constructor(private scheduledEmailDao: ScheduledEmailDao, private userDao: UserDao, private meetDao: MeetDao) {}

  async getEmailsToBeSent(): Promise<EmailContext[]> {
    let records;
    try {
      records = await this.scheduledEmailDao.getEmailsToSend();
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
          if (!templateExists(templateName)) {
            throw new Error(`Template [${templateName}] does not exist.`);
          }

          const _isBulk = !!meetRecipientId; // <-- currently, presence of meetRecipientId is the only indicator of bulk email

          let recipients: User[] = [];
          let meet: Meet | undefined;

          if (meetRecipientId) {
            recipients = await this.userDao.getMany({ meetId: meetRecipientId });
          } else if (userRecipientId) {
            const user = await this.userDao.getOne({ id: userRecipientId });
            recipients = user ? [user] : [];
          } else {
            throw new Error("scheduledEmail record did not have meetRecipientId or userReceipientId.");
          }

          if (meetId) {
            try {
              meet = await this.meetDao.getOne({ id: meetId });
              if (!meet)
                throw new Error(
                  `Failed to find meet with id: ${meetId} for scheduled email with id ${id}. Aborting send.`,
                );
            } catch (e) {
              throw new Error(
                `Something went wrong when attempting to fetch meet with id ${meetId} for scheduled email: ${id}. Aborting send.`,
              );
            }
          }

          // For now, generating calendar invite attachements in EmailService as they are not personalized and are the same for all recipients in a scheduledEmail
          let _attachments: Attachment[] = [];
          if (meet) {
            switch (templateName) {
              case HACKATHONS_REGISTRATION_CONFIRMATION:
                // Hackathon invites should only block 1hr on recipient's calendar (as opposed to entire 7 days)
                _attachments = generateMeetIcsAttachments(meet, {
                  duration: { minutes: 60 },
                  customTitle: `Kickoff for ${meet.title}`,
                });
                break;
              case WORKSHOPS_REGISTRATION_CONFIRMATION:
                _attachments = generateMeetIcsAttachments(meet);
                break;
              default:
                _attachments = [];
            }
          }

          return {
            _type: "SUCCESS",
            _scheduledEmailId: id,
            _templateName: templateName,
            _isBulk,
            _attachments,
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
}
