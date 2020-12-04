import MeetDao from "../dao/MeetDao";
import MeetRegistrationDao, { MeetRegistrationDaoAddOneArgs } from "../dao/MeetRegistrationDao";
import { EmailCommander, EmailTemplateName, ScheduledEmailInput } from "../types/Email";
import { Meet } from "../types/gqlGeneratedTypes";
import MeetRegistration from "../types/MeetRegistration";
import config from "../util/config";
import { ensureExists } from "../util/ensureExists";
import { nDaysAndHoursFromTargetInUtcTime, wallclockToUtcDate } from "../util/timeUtils";

const { disableRegistrationEmail } = config;
const {
  HACKATHON_REGISTRATION_CONFIRM,
  HACKATHON_REGISTRATION_REMINDER_1,
  HACKATHON_REGISTRATION_REMINDER_2,
  WORKSHOP_REGISTRATION_CONFIRM,
  WORKSHOP_REGISTRATION_REMINDER_1,
  WORKSHOP_REGISTRATION_REMINDER_2,
} = EmailTemplateName;

export default class MeetRegistrationService {
  constructor(
    private meetRegistrationDao: MeetRegistrationDao,
    private emailCommander: EmailCommander,
    private meetDao: MeetDao,
  ) {}

  async addOne(args: MeetRegistrationDaoAddOneArgs): Promise<MeetRegistration> {
    // register for meet
    const meetRegistration = await this.meetRegistrationDao.addOne(args);

    // registration was successsful - queue emails
    const { userId, meetId } = args;
    const meet = ((await this.meetDao.getOne({ id: meetId })) as unknown) as Meet;
    ensureExists("Meet")(meet);

    if (!disableRegistrationEmail) {
      // TODO: align meetTypes with Celeste's new branch - currently 'hackMeet' but will become 'hackathon'
      if (meet.meetType === "hackMeet") {
        const hackathonEmails = buildHackathonEmailQueue(meet, userId);
        await this.emailCommander.queue(hackathonEmails);
      } else {
        const workshopEmails = buildWorkshopEmailQueue(meet, userId);
        await this.emailCommander.queue(workshopEmails);
      }
    }

    return meetRegistration;
  }
}

const buildHackathonEmailQueue = (meet: Meet, userId: string): ScheduledEmailInput[] => {
  // immediate
  const sendAtConfirm = new Date().toISOString();
  // startTime -1 day
  const sendAtReminder1 = nDaysAndHoursFromTargetInUtcTime(-1, 0, wallclockToUtcDate(meet.startTime, meet.region));
  // startTime -30 mins
  const sendAtReminder2 = nDaysAndHoursFromTargetInUtcTime(0, -0.5, wallclockToUtcDate(meet.startTime, meet.region));
  console.log({ sendAtConfirm, sendAtReminder1, sendAtReminder2 });
  const confirmationEmail = {
    templateName: HACKATHON_REGISTRATION_CONFIRM,
    userId,
    meetId: meet.id,
    // immediately
    sendAt: sendAtConfirm,
  };

  // only send reminder1 if registration precedes reminder1 sendAt time
  const reminder1 = {
    templateName: HACKATHON_REGISTRATION_REMINDER_1,
    userId,
    meetId: meet.id,
    // startTime -1 day
    sendAt: sendAtReminder1,
  };
  const reminder2 = {
    templateName: HACKATHON_REGISTRATION_REMINDER_2,
    userId,
    meetId: meet.id,
    // startTime -30 min
    sendAt: sendAtReminder2,
  };
  return [confirmationEmail, reminder1, reminder2];
};

const buildWorkshopEmailQueue = (meet: Meet, userId: string): ScheduledEmailInput[] => {
  const confirmationEmail = {
    templateName: WORKSHOP_REGISTRATION_CONFIRM,
    userId,
    meetId: meet.id,
    // immediately
    sendAt: new Date().toISOString(),
  };
  const reminder1 = {
    templateName: WORKSHOP_REGISTRATION_REMINDER_1,
    userId,
    meetId: meet.id,
    sendAt: new Date().toISOString(),
    // startTime -1 day
    // sendAt: nDaysAndHoursFromTargetInUtcTime(-1, 0, wallclockToUtcDate(meet.startTime, meet.region)),
  };
  const reminder2 = {
    templateName: WORKSHOP_REGISTRATION_REMINDER_2,
    userId,
    meetId: meet.id,
    sendAt: new Date().toISOString(),
    // startTime -30 min
    // sendAt: nDaysAndHoursFromTargetInUtcTime(0, -0.5, wallclockToUtcDate(meet.startTime, meet.region)),
  };
  return [confirmationEmail, reminder1, reminder2];
};
