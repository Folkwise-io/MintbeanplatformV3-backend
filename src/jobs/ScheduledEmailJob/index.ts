import { knex } from "../../db/knex";
import { Email, ScheduledEmail } from "../../types/Email";
import config from "../../util/config";
import sgMail from "@sendgrid/mail";
import * as fs from "fs";
import path from "path";
import { ClientResponse } from "@sendgrid/client/src/response";
import ResponseError from "@sendgrid/helpers/classes/response-error";

/** Covers possible response codes from email API. Sendgrid only returns: 2xx, 4xx, or 5xx.
See https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/errors.html */
enum EmailResponseStatus {
  SUCCESS = "SUCCESS",
  BAD_REQUEST = "BAD_REQUEST",
  API_SERVER_ERROR = "API_SERVER_ERROR", // sendgrid's fault
}

interface EmailResponse {
  scheduledEmailId: string;
  recipient: string;
  sender: string;
  statusCode: number;
  status: EmailResponseStatus;
  response: ClientResponse;
  errors?: ResponseError[];
}

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
const lockJob = async (jobCb: () => void) => {
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
    // there is no lock, just continue.
  }

  try {
    writeLockfileSync();
  } catch (e) {
    console.log("Problem writing lockfile. Canceling job.");
    console.log(e);
    return;
  }

  try {
    // JOB START
    jobCb();
  } finally {
    try {
      deleteLockfileSync();
    } catch (e) {
      console.log("Problem deleting lock file");
      console.log(e);
    }
  }
};

// TODO: remove this. Used for testing only to mock api call without spamming claire's inbox
// const sleep = (ms: number) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

const deleteScheduledEmailById = async (id: string) => {
  try {
    await knex("scheduledEmails").where({ id }).del();
  } catch (e) {
    console.error(`Error when deleting scheduled email with id ${id}: `, e);
  }
};

const getScheduledEmails = async () => {
  try {
    return await knex<ScheduledEmail>("scheduledEmails");
  } catch (e) {
    console.error("Error attempting to fetch scheduled emails: ", e);
  }
};

const mapResponseStatus = (statusCode: number): EmailResponseStatus => {
  if (statusCode < 300) {
    return EmailResponseStatus.SUCCESS;
  }
  if (statusCode < 500) {
    return EmailResponseStatus.BAD_REQUEST;
  }
  return EmailResponseStatus.API_SERVER_ERROR;
};

// Job definition =================================================================
const job = async () => {
  await lockJob(async () => {
    const scheduledEmails = await getScheduledEmails();
    if (!scheduledEmails) return;

    const generateEmailFromScheduledEmail = ({ to, from, html, subject }: ScheduledEmail) => ({
      to,
      from,
      html,
      subject,
    });

    const emailsWithDetails = scheduledEmails.map((se) => {
      const email = generateEmailFromScheduledEmail(se);
      return {
        scheduledEmailId: se.id,
        recipient: se.to,
        sender: se.from,
        email,
      };
    });

    const emailsWithDetailsPromises = emailsWithDetails.map(({ scheduledEmailId, recipient, sender, email }) => {
      const metaData = { scheduledEmailId, recipient, sender };

      return new Promise<EmailResponse>(async (resolve, reject) => {
        try {
          const [response] = await sgMail.send(email);
          const { statusCode } = response;
          resolve({
            ...metaData,
            statusCode,
            status: mapResponseStatus(statusCode),
            response,
          });
        } catch (e) {
          const { code, response } = e;
          reject({
            ...metaData,
            statusCode: code,
            status: mapResponseStatus(code),
            response,
            errors: response.body.errors,
          });
        }
      });
    });

    const promises = await Promise.allSettled(emailsWithDetailsPromises);
    promises.forEach(async (promise) => {
      if (promise.status === "rejected") {
        console.warn(`EMAIL SEND FAILED`);
        console.warn(promise.reason);
      } else {
        // TOOD: Remove logging of success cases. Debugging only
        console.log("EMAIL SEND SUCCESS");
        console.log(promise.value);
        // Delete successfully sent scheduled emails (note: this works because scheduled emails are currently 1:1 with recipient)
        const { scheduledEmailId: id } = promise.value;
        await deleteScheduledEmailById(id);
      }
    });
  });
};

// TODO: job is hanging - how to fix?
(async () => await job().catch((e) => console.log(e)))().finally(() => console.log("Done"));
// job();
// console.log("Done");

// sample rejected promise reason:

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
