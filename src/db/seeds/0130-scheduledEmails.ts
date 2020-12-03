import * as Knex from "knex";
import { ScheduledEmail } from "../../types/Email";
import { nDaysAndHoursFromNowInUtcTime } from "../../util/timeUtils";
import { EmailTemplateName } from "../../types/Email";

const {
  HACKATHON_REGISTRATION_CONFIRM,
  HACKATHON_REGISTRATION_REMINDER_1,
  HACKATHON_REGISTRATION_REMINDER_2,
} = EmailTemplateName;
export async function seed(knex: Knex): Promise<void> {
  await knex("scheduledEmails").del();

  await knex<ScheduledEmail>("scheduledEmails").insert([
    {
      templateName: HACKATHON_REGISTRATION_CONFIRM,
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "00000000-0000-0000-0000-000000000000",
      sendAt: nDaysAndHoursFromNowInUtcTime(0, 1),
    },
    {
      templateName: HACKATHON_REGISTRATION_REMINDER_1,
      userId: "00000000-0000-4000-a000-000000000000",
      meetId: "00000000-0000-0000-0000-000000000000",
      sendAt: nDaysAndHoursFromNowInUtcTime(1),
    },
    {
      templateName: HACKATHON_REGISTRATION_REMINDER_2,
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "00000000-0000-0000-0000-000000000000",
      sendAt: nDaysAndHoursFromNowInUtcTime(2),
    },
  ]);
}
