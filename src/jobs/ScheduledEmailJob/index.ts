import jobContextBuilder from "../jobContextBuilder";
import { scheduledEmailJobBuilder } from "./scheduledEmailJob";

const jobContext = jobContextBuilder();
const scheduledEmailJob = scheduledEmailJobBuilder(jobContext);

(async () => {
  scheduledEmailJob()
    .catch((e) => console.log("Scheduled email job failed: ", e))
    .finally(() => {
      console.log("Process shutdown started");
      jobContext.knex.destroy(() => {
        console.log("Knex shut down successfully. Exiting process.");
      });
    });
})();
