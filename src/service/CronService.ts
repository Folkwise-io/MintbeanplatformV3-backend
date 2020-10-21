import cron from "cron";
const { CronJob } = cron;

import { EmailCommander } from "../types/Email";

export default class CronService {
  constructor(private emailCommander: EmailCommander) {}

  // Needs to be an arrow function, otherwise this.emailCommander is undefined
  sendEmails = () => {
    return this.emailCommander
      .getOverdueScheduledEmails()
      .then((scheduledEmails) => scheduledEmails.map(this.emailCommander.dispatch))
      .then((emailResponsePromises) => Promise.all(emailResponsePromises))
      .then((emailResponses) => {
        if (emailResponses.length > 0) {
          console.log(emailResponses);
        }
      });
  };

  start() {
    const emailJob = new CronJob("*/5 * * * * *", this.sendEmails, null, false, "America/Toronto");
    emailJob.start();
  }
}
