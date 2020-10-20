import cron from "cron";
const { CronJob } = cron;

import { EmailCommander } from "../types/Email";

export default class CronService {
  constructor(private emailCommander: EmailCommander) {}

  // Needs to be an arrow function, otherwise this.emailCommander is undefined
  sendEmails = () => {
    return this.emailCommander
      .getOverdueScheduledEmails()
      .then((scheduledEmails) => scheduledEmails.map((scheduledEmail) => this.emailCommander.dispatch(scheduledEmail)))
      .then((responsePromises) => Promise.all(responsePromises))
      .then((responses) => console.log(responses));
  };

  start() {
    const emailJob = new CronJob("*/5 * * * * *", this.sendEmails, null, false, "America/Toronto");
    emailJob.start();
  }
}
