import {
  Attachment,
  Email,
  EmailResponse,
  EmailResponseStatus,
  EmailTemplateName,
  ScheduledEmailInput,
} from "../../types/ScheduledEmail";
import config from "../../util/config";
import sgMail from "@sendgrid/mail";
import * as fs from "fs";
import path from "path";

import { JobContext } from "../jobContextBuilder";
import { templateByName } from "./templateUtil";

const { sendgridKey } = config;
sgMail.setApiKey(sendgridKey);

const LOCKFILE_NAME = ".lock";
const LOCKFILE_PATH = path.join(__dirname, LOCKFILE_NAME);
const LOCKFILE_EXPIRY_SECONDS = 5;

interface EmailDataObj {
  requeueData: ScheduledEmailInput | null; // this field is populated with requeueData data with individual userRecipient if email is member of a bulk job
  scheduledEmailIdNonce: string;
  email: {
    to: string;
    from: string;
    subject: string;
    html: string;
    attachments: Attachment[];
  };
}

// FUTURE: Lockfile log: if more jobs added in the future that need lockfiles, this logic can be encapsulated in anoter file. Warning: must consider filepath resolution if calling from another file
const doesFileExist = () => {
  try {
    fs.accessSync(LOCKFILE_PATH, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
};

const writeLockfileSync = () => {
  const expiry = new Date().getTime() + LOCKFILE_EXPIRY_SECONDS * 1000;
  fs.writeFileSync(LOCKFILE_PATH, "" + expiry);
};

const deleteLockfileSync = () => {
  fs.unlinkSync(LOCKFILE_PATH);
};

const isExpiryReached = () => {
  try {
    const expiryEpoch = +fs.readFileSync(LOCKFILE_PATH, "utf8");
    const isExipred = new Date() > new Date(expiryEpoch);
    return isExipred;
  } catch {
    false;
  }
};

// Wrap job logic in lockfile flow
const lockJob = async (jobCb: () => Promise<void>) => {
  // only run job if lockfile not present
  if (doesFileExist()) {
    if (isExpiryReached()) {
      // there was a job that failed before, and could not clean up the lockfile
      // refresh the file with a new expiry
      try {
        writeLockfileSync();
      } catch (e) {
        console.log("Problem writing lockfile. Canceling job", e);
        return;
      }
    } else {
      console.log("Job cancelled. Job was attempted while another process is running.");
      // there is another process running (probably). do nothing, just stop.
      return;
    }
  } else {
    // there is no lock, just continue after creating new lock file.
    try {
      writeLockfileSync();
    } catch (e) {
      console.log("Problem writing lockfile. Canceling job.", e);
      return;
    }
  }

  try {
    // JOB START
    await jobCb();
  } finally {
    try {
      deleteLockfileSync();
    } catch (e) {
      console.log("Problem deleting lock file", e);
    }
  }
};

// Job definition =================================================================
export const scheduledEmailJobBuilder = (context: JobContext): (() => Promise<void>) => {
  return () =>
    lockJob(
      async (): Promise<void> => {
        const emailContexts = await context.emailService.getEmailsToBeSent();

        const emailDataObjs = emailContexts.flatMap((ctx) => {
          return ctx.recipients.map(
            (recipient): EmailDataObj => {
              const { subject, body } = templateByName(ctx._templateName, {
                recipient,
                meet: ctx.meet,
              });
              let requeueData: ScheduledEmailInput | null = null;
              // provide data for requeuing individual userRecipient if email is part of bulk job, in case send fails
              // WARNING: if nullable fields are added to `schduledEmails` must account for them here
              if (ctx._isBulk) {
                requeueData = {
                  // ensure it is requeued as individual userRecipient (no bulk recipient fields like meetRecipientId)
                  userRecipientId: recipient.id,
                  templateName: ctx._templateName as EmailTemplateName,
                  meetId: ctx.meet?.id || null,
                };
              }
              return {
                requeueData,
                scheduledEmailIdNonce: ctx._scheduledEmailId,
                email: {
                  to: recipient.email,
                  from: "noreply@mintbean.io",
                  subject,
                  html: body,
                  attachments: ctx._attachments,
                },
              };
            },
          );
        });

        const deletedEmails = new Set<string>();

        // send the emails
        await Promise.allSettled(
          emailDataObjs.map(async (data) => {
            const scheduledEmailId = data.scheduledEmailIdNonce;

            // Try to send the email
            let emailResponse;
            try {
              emailResponse = await context.emailApiDao.send(data.email);
              console.log(`EMAIL RESPONSE from scheduled email: ${scheduledEmailId}\n`, emailResponse);
            } catch (e) {
              // Handle network failures
              console.error(`Failed to send scheduled email: [${scheduledEmailId}].`, e);
              return;
            }
            if (emailResponse.status === EmailResponseStatus.SUCCESS) {
              // Delete each successfully sent email from the DB
              if (deletedEmails.has(scheduledEmailId)) {
                // Don't delete scheduled emails that have already sent one member successfully
                return;
              }

              try {
                await context.scheduledEmailDao.deleteOne(scheduledEmailId);
                deletedEmails.add(scheduledEmailId);
                return;
              } catch (e) {
                try {
                  // retry once, in case
                  await context.scheduledEmailDao.deleteOne(scheduledEmailId);
                  deletedEmails.add(scheduledEmailId);
                  return;
                } catch (e) {
                  // something REALLY went wrong with the db
                  console.error(
                    `Critical failure, tried twice could not delete successfully sent scheduledEmailId [${scheduledEmailId}].`,
                  );
                }
              }
            } else {
              // Handle the case where the email could not be sent at all

              // If this email is a member of a bulk-recipient scheduled email (i.e requeueData is present), re-queue it as a stand-alone job with 2 tries left
              if (data.requeueData) {
                try {
                  await context.scheduledEmailDao.queue({ ...data.requeueData, retriesLeft: 2 });
                } catch (e) {
                  console.log(`Error when requeueing failed member of scheduled email: ${scheduledEmailId}.`, e);
                }
              } else {
                // this is a failed scheduld email with single recipient
                let retriesLeft = 2; // in case step below fails

                try {
                  retriesLeft = await context.scheduledEmailDao.getRetriesLeft(scheduledEmailId);
                } catch (e) {
                  console.log("Error when getting scheduled email retries left.", e);
                }

                if (retriesLeft > 0) {
                  try {
                    await context.scheduledEmailDao.decrementRetriesLeft(scheduledEmailId);
                  } catch (e) {
                    console.log("Error when decrementing scheduled email retries left.", e);
                  }
                }
              }

              // Either outcome, log the failure
              console.log(`Failed to send email with scheduled email id: ${scheduledEmailId}`, emailResponse);
            }
          }),
        );
      },
    );
};
