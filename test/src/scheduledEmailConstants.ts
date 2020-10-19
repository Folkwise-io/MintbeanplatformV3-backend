import { EmailTemplateName, ScheduledEmail } from "../../src/types/Email";
import { nDaysAndHoursFromNowInUtcTime } from "../../src/util/timeUtils";
import { ALGOLIA } from "./meetConstants";
import { AMY } from "./userConstants";

const { MEET_REGISTRATION, CHECK_IN_AFTER_SIGN_UP, ALL } = EmailTemplateName;

export const AMY_ALGOLIA_SCHEDULED_EMAIL: ScheduledEmail = {
  id: "00000000-0000-0000-0000-000000000000",
  templateName: MEET_REGISTRATION,
  userId: AMY.id,
  meetId: ALGOLIA.id,
  sendAt: nDaysAndHoursFromNowInUtcTime(0),
  sent: false,
  createdAt: nDaysAndHoursFromNowInUtcTime(0),
};
