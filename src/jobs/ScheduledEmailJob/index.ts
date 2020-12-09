import { knex } from "../../db/knex";
import { Email, ScheduledEmail } from "../../types/Email";
import config from "../../util/config";
import sgMail from "@sendgrid/mail";
import * as fs from "fs";
import path from "path";
import { ClientResponse } from "@sendgrid/client/src/response";
import ResponseError from "@sendgrid/helpers/classes/response-error";

interface EmailWithIdResponse {
  scheduledEmailId: string;
  response?: ClientResponse;
  error?: ResponseError;
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

// TODO: remove this. Used for testing only to mock api call without spamming claire's inbox
// const sleep = (ms: number) => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

const deleteScheduledEmailById = async (id: string) => {
  try {
    await knex("scheduledEmails").where({ id }).del();
  } catch (e) {
    console.error("Error when deleting scheduled email: ", e);
  }
};

// Job definition =================================================================
const job = async () => {
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
    // get all scheduledEmails, convert to email format
    const scheduledEmails = await knex<ScheduledEmail>("scheduledEmails");

    const generateEmailFromScheduledEmail = ({ to, from, html, subject }: ScheduledEmail) => ({
      to,
      from,
      html,
      subject,
    });

    const emailsWithId = scheduledEmails.map((se) => {
      const email = generateEmailFromScheduledEmail(se);
      return {
        scheduledEmailId: se.id,
        email,
      };
    });

    const emailsWithIdPromises = emailsWithId.map(({ scheduledEmailId, email }) => {
      return new Promise<EmailWithIdResponse>(async (resolve, reject) => {
        try {
          const [response] = await sgMail.send(email);
          resolve({ scheduledEmailId, response });
        } catch (e) {
          console.log("Bad email error: ", e);
          reject({ scheduledEmailId, error: e });
        }
        // const wasSuccess = (response: ClientResponse): boolean => {
        //   const { statusCode } = response;
        //   return statusCode >= 200 && statusCode < 300;
        // };
      });
    });

    const promises = await Promise.allSettled(emailsWithIdPromises);
    promises.forEach(async (promise) => {
      if (promise.status === "rejected") {
        console.log("Reject reason: ", promise.reason);
      } else {
        // TOOD: Remove. Debugging only
        console.log(promise.value);
        // Delete successfully sent scheduled emails (note: this works because scheduled emails are currently 1:1 with recipient)
        const { scheduledEmailId } = promise.value;
        await deleteScheduledEmailById(scheduledEmailId);
      }
    });
  } finally {
    try {
      deleteLockfileSync();
    } catch (e) {
      console.log("Problem deleting lock file");
      console.log(e);
    }
  }
};

(async () => await job().catch((e) => console.log(e)))();
