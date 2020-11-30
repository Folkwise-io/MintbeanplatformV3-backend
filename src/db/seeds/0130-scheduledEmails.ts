import * as Knex from "knex";
import { ScheduledEmail } from "../../types/Email";
import { nDaysAndHoursFromNowInUtcTime } from "../../util/timeUtils";
import { EmailTemplateName } from "../../types/Email";

const { MEET_REGISTRATION, CHECK_IN_AFTER_SIGN_UP, ALL } = EmailTemplateName;
export async function seed(knex: Knex): Promise<void> {
  await knex("scheduledEmails").del();

  await knex<ScheduledEmail>("scheduledEmails").insert([
    {
      templateName: MEET_REGISTRATION,
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "00000000-0000-0000-0000-000000000000",
      sendAt: nDaysAndHoursFromNowInUtcTime(0, 1),
    },
    {
      templateName: MEET_REGISTRATION,
      userId: "00000000-0000-4000-a000-000000000000",
      meetId: "87496d2d-ae36-4039-bd14-45bd0de3929c",
      sendAt: nDaysAndHoursFromNowInUtcTime(1),
    },
    {
      templateName: CHECK_IN_AFTER_SIGN_UP,
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: null,
      sendAt: nDaysAndHoursFromNowInUtcTime(2),
    },
    {
      templateName: ALL,
      userId: null,
      meetId: null,
      html: `
      <html>
        <body>
          Hello world
        </body>
      </html>
      `,
      sendAt: nDaysAndHoursFromNowInUtcTime(3),
    },
  ]);
}
