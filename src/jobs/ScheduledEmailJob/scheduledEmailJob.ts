import { Email, EmailResponse, EmailResponseStatus } from "../../types/ScheduledEmail";
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
        console.log("Problem writing lockfile. Canceling job");
        console.log(e);
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
      console.log("Problem writing lockfile. Canceling job.");
      console.log(e);
      return;
    }
  }

  try {
    // JOB START
    await jobCb();
    // await sleep(3000); // simulate long api call
  } finally {
    try {
      deleteLockfileSync();
    } catch (e) {
      console.log("Problem deleting lock file");
      console.log(e);
    }
  }
};

// const deleteScheduledEmailById = async (id: string) => {
//   try {
//     await knex("scheduledEmails").where({ id }).del();
//   } catch (e) {
//     console.error(`Error when deleting scheduled email with id ${id}: `, e);
//   }
// };

// const getScheduledEmails = async () => {
//   try {
//     return await knex<ScheduledEmail>("scheduledEmails");
//   } catch (e) {
//     console.error("Error attempting to fetch scheduled emails: ", e);
//   }
// };

// const generateEmailFromScheduledEmail = ({ to, from, html, subject }: ScheduledEmail) => ({
//   to,
//   from,
//   html,
//   subject,
// });

interface EmailDataObj {
  scheduledEmailId: string;
  email: {
    to: string;
    from: string;
    subject: string;
    html: string;
  };
}

// Job definition =================================================================
export const scheduledEmailJobBuilder = (context: JobContext): (() => Promise<void>) => {
  return () =>
    lockJob(
      async (): Promise<void> => {
        const contexts = await context.emailService.getEmailsToBeSent();

        const emailDataObjs = contexts.flatMap((context) => {
          return context.recipients.map(
            (recipient): EmailDataObj => {
              const { subject, body } = templateByName(context.templateName, {
                recipient,
                meet: context.meet,
              });
              return {
                scheduledEmailId: context.scheduledEmailId,
                email: {
                  to: recipient.email,
                  from: "noreply@mintbean.io",
                  subject,
                  html: body,
                },
              };
            },
          );
        });

        const responsePromises = emailDataObjs.map(async (data) => {
          return new Promise<EmailResponse>(async (resolve, reject) => {
            const { email, scheduledEmailId } = data;
            let alreadyDeleted: string[] = [];

            // const response = await mockSgMailSend(email);
            const response = await context.emailApiDao.send(email);
            if (response.status === EmailResponseStatus.SUCCESS) {
              resolve(response);
            } else {
              reject(response);
            }
          });
        });

        const settledResponsePromises = await Promise.allSettled<Promise<EmailResponse>>(responsePromises);
        const settledSuccessResponses = (settledResponsePromises.filter(
          (res) => res.status === "fulfilled",
        ) as unknown) as PromiseFulfilledResult<EmailResponse>[];
        const successResponses = settledSuccessResponses.map((res) => res.value);
        console.log({ successResponses });

        const settledRejectedResponses = (settledResponsePromises.filter(
          (res) => res.status === "rejected",
        ) as unknown) as PromiseRejectedResult[];
        const rejectResponses = settledRejectedResponses.map((res) => res.reason);
        console.log({ rejectResponses });
      },
    );
};

//  if (response.status === EmailResponseStatus.SUCCESS) {
//    console.log("[EMAIL SEND: SUCCESS] ", response);
//    if (alreadyDeleted.includes(scheduledEmailId)) {
//      return;
//    } else {
//      try {
//        await context.scheduledEmailDao.deleteOne(scheduledEmailId);
//        alreadyDeleted.push(scheduledEmailId);
//      } catch (e) {
//        console.error(
//          `ERROR when attempting to delete successfully sent sheduled email with id ${scheduledEmailId}. `,
//          e,
//        );
//      }
//    }
//  } else {
//    console.error("[EMAIL SEND: FAILURE] ", response);
//  }

// old logic
// console.log({ emailsWithScheduledEmailId: emails });

// const emailsWithScheduledEmailIdPromises = emailsWithScheduledEmailId.map(({ scheduledEmailId, email }) => {
//   return new Promise<EmailResponseWithScheduledEmailId>(async (resolve, reject) => {
//     // No try/catch here because emailApiDao gracefully handles failed email sends

//     const emailResponse = await context.emailApiDao.send(email);
//     // const [response] = await mockSgMailSend(email);

//     const emailResponseWithScheduledEmailId = {
//       ...emailResponse,
//       scheduledEmailId,
//     };

//     if (emailResponse.status === EmailResponseStatus.SUCCESS) {
//       resolve(emailResponseWithScheduledEmailId);
//     } else {
//       reject(emailResponseWithScheduledEmailId);
//     }
//   });
// });

// const promises = await Promise.allSettled(emailsWithScheduledEmailIdPromises);
// promises.forEach(async (promise) => {
//   if (promise.status === "rejected") {
//     console.warn(`EMAIL SEND FAILED`);
//     console.warn(promise.reason);
//   } else {
//     // TOOD: Remove logging of success cases. Debugging only
//     console.log("EMAIL SEND SUCCESS");
//     console.log(promise.value);
//     // Delete successfully sent scheduled emails (note: this works because scheduled emails are currently 1:1 with recipient)
//     const { scheduledEmailId: id } = promise.value;
//     try {
//       await context.scheduledEmailDao.deleteOne(id);
//     } catch (e) {
//       console.log("Failed to delete sent scheduled email. ", e);
//     }
//   }
// });

// {
//   scheduledEmailId: 'e7a12c54-8879-4e04-ab89-161f69db4f18',
//   recipient: 'claire.froelich@gmail.com',
//   sender: '2'
//   statusCode: 400,
//   status: 'BAD_REQUEST',
//   response: {
//     headers: {
//       server: 'nginx',
//       date: 'Wed, 09 Dec 2020 19:08:40 GMT',
//       'content-type': 'application/json',
//       'content-length': '185',
//       connection: 'close',
//       'access-control-allow-origin': 'https://sendgrid.api-docs.io',
//       'access-control-allow-methods': 'POST',
//       'access-control-allow-headers': 'Authorization, Content-Type, On-behalf-of, x-sg-elas-acl',
//       'access-control-max-age': '600',
//       'x-no-cors-reason': 'https://sendgrid.com/docs/Classroom/Basics/API/cors.html'
//     },
//     body: { errors: [Array] }
//   },
//   errors: [
//     {
//       message: 'The from email does not contain a valid address.',
//       field: 'from.email',
//       help: 'http://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/errors.html#message.from'
//     }
//   ]
// }

// sample resolved promise value:

// {
//   scheduledEmailId: '2ed0e215-aac9-4f2b-b3f3-6c8ebe53119f',
//   recipient: 'claire.froelich@gmail.com',
//   sender: 'noreply@mintbean.io',
//   statusCode: 202,
//   status: 'SUCCESS',
//   response: Response {
//     statusCode: 202,
//     body: '',
//     headers: {
//       server: 'nginx',
//       date: 'Wed, 09 Dec 2020 19:08:40 GMT',
//       'content-length': '0',
//       connection: 'close',
//       'x-message-id': 'mEP4pfmxTSaIrIdEgxdAdw',
//       'access-control-allow-origin': 'https://sendgrid.api-docs.io',
//       'access-control-allow-methods': 'POST',
//       'access-control-allow-headers': 'Authorization, Content-Type, On-behalf-of, x-sg-elas-acl',
//       'access-control-max-age': '600',
//       'x-no-cors-reason': 'https://sendgrid.com/docs/Classroom/Basics/API/cors.html'
//     }
//   }
// }

// TODO: remove all this below. Used for testing only to mock api call without using API credits
const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/** include "!FAIL" in the email.subject to force failed return */
const mockSgMailSend = async (email: Email): Promise<EmailResponse> => {
  const shouldFail = !!email.subject.match(/!FAIL/);
  if (shouldFail) {
    console.log("FAKE SENDING FAILURE EMAIL...");
    // console.log(email);
    const failureResponse = {
      recipient: "claire.froelich@gmail.com",
      sender: "noreply@mintbean.io",
      statusCode: 400,
      status: EmailResponseStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
    };

    throw failureResponse;
  }

  const successResponse = {
    recipient: "claire.froelich@gmail.com",
    sender: "noreply@mintbean.io",
    statusCode: 202,
    status: EmailResponseStatus.SUCCESS,
    timestamp: new Date().toISOString(),
  };
  console.log("FAKE SENDING SUCCESS EMAIL...");
  // console.log(email);
  // awaitsleep(500);
  return successResponse;
};
