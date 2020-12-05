import cron from "cron";
const { CronJob } = cron;

import { EmailCommander, EmailResponse } from "../types/Email";
import EmailDaoSendgridKnex from "../dao/EmailDaoSendgridKnex";

export default class CronService {
  constructor(private emailCommander: EmailCommander, private emailDao: EmailDaoSendgridKnex) {}

  // Needs to be an arrow function, otherwise this.emailCommander is undefined
  // sendEmails = () => {
  //   return this.emailCommander
  //     .getOverdueScheduledEmails()
  //     .then((scheduledEmails) => scheduledEmails.map(this.emailCommander.dispatch))
  //     .then((emailResponsePromises) => Promise.all(emailResponsePromises))
  //     .then((emailResponses) => {
  //       if (emailResponses.length > 0) {
  //         console.log(emailResponses);
  //       }
  //     });
  // };
  sendEmails = async () => {
    const scheduledEmails = await this.emailCommander.getOverdueScheduledEmails();
    const emailResponsePromises = await scheduledEmails.map(this.emailCommander.dispatch);
    const emailResponses = await Promise.allSettled(emailResponsePromises);

    // TODO : If email sends successfully, delete scheduled email from db. if send fails, skeep shceduled email in db

    const successes = (emailResponses.filter(
      (x) => x.status === "fulfilled",
    ) as unknown) as PromiseFulfilledResult<EmailResponse>[];
    const failures = (emailResponses.filter((x) => x.status === "rejected") as unknown) as PromiseRejectedResult[];

    failures.forEach((failure) => console.log(failure.reason));

    const deletePromises = successes.map((x) => new Promise(this.emailDao.deleteOne(x.id)));
    const deleteResults = ((await Promise.allSettled(
      deletePromises,
    )) as unknown) as PromiseSettledResult<EmailResponse>[];

    const deleteFailures = deleteResults.filter((x) => x.status === "rejected") as PromiseRejectedResult[];

    deleteFailures.forEach((failure) => console.log(failure.reason));
  };

  start() {
    const emailJob = new CronJob("*/5 * * * * *", this.sendEmails, null, false, "America/Toronto");
    emailJob.start();
  }
}
