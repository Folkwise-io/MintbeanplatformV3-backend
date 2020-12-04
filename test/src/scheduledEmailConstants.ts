import { EmailTemplateName, ScheduledEmail } from "../../src/types/Email";
import { nDaysAndHoursFromTargetInUtcTime } from "../../src/util/timeUtils";
import { ALGOLIA } from "./constants/meetConstants";
import { AMY } from "./constants/userConstants";

const { HACKATHON_REGISTRATION_CONFIRM } = EmailTemplateName;

export const AMY_ALGOLIA_SCHEDULED_EMAIL: ScheduledEmail = {
  id: "00000000-0000-0000-0000-000000000000",
  templateName: HACKATHON_REGISTRATION_CONFIRM,
  userId: AMY.id,
  meetId: ALGOLIA.id,
  sendAt: nDaysAndHoursFromTargetInUtcTime(0),
  sent: false,
  createdAt: nDaysAndHoursFromTargetInUtcTime(0),
};
