import * as Knex from "knex";
import { nDaysAndHoursFromNowInWallClockTime } from "../../util/timeUtils";
export async function seed(knex: Knex): Promise<void> {
  await knex("scheduledEmails").del();

  await knex("scheduledEmails").insert([
    {
      templateName: "meetRegistration",
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "00000000-0000-0000-0000-000000000000",
      sendAt: nDaysAndHoursFromNowInWallClockTime(2),
    },
    {
      templateName: "meetRegistration",
      userId: "00000000-0000-4000-a000-000000000000",
      meetId: "87496d2d-ae36-4039-bd14-45bd0de3929c",
      sendAt: nDaysAndHoursFromNowInWallClockTime(1),
    },
  ]);
}
