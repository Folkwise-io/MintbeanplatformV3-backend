import { knex } from "../../db/knex";
import { Email } from "../../types/Email";
import config from "../../util/config";
import sgMail from "@sendgrid/mail";
import * as fs from "fs";
import path from "path";

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

const writeLockfile = () => {
  const expiry = new Date().getTime() + LOCKFILE_EXPIRY_SECONDS * 1000;
  fs.writeFileSync(LOCKFILE_PATH, "" + expiry);
};

const deleteLockfile = () => {
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

// Job definition =================================================================
const job = async () => {
  // only run job if lockfile not present
  if (doesFileExist()) {
    if (isExpiryReached()) {
      // there was a job that failed before, and could not clean up the lockfile
      // refresh the file with a new expiry
      try {
        writeLockfile();
      } catch (e) {
        console.log("Problem writing lockfile. Canceling job");
        console.log(e);
        return;
      }
    } else {
      console.warn("Job cancelled. Job was attempted while another process is running.");
      // there is another process running (probably). do nothing, just stop.
      return;
    }
  } else {
    // there is no lock, just continue.
  }

  try {
    writeLockfile();
  } catch (e) {
    console.log("Problem writing lockfile. Canceling job.");
    console.log(e);
    return;
  }

  try {
    // get all scheduledEmails
    const emails = await knex<Email>("scheduledEmails");
    const promises = await Promise.allSettled(emails.map((email) => sgMail.send(email)));
    promises.forEach((promise) => {
      if (promise.status === "rejected") {
        console.log(promise.reason);
      } else {
        console.log(promise.value);
      }
    });
  } finally {
    try {
      deleteLockfile();
    } catch (e) {
      console.log("Problem deleting lock file");
      console.log(e);
    }
  }
};

job();
