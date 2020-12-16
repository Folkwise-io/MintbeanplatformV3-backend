import MeetDao, { MeetDaoAddOneInput } from "../dao/MeetDao";
import { Meet, MeetType } from "../types/gqlGeneratedTypes";
import { EmailTemplateName } from "../types/ScheduledEmail";
import { getISOString, msDifference } from "../util/timeUtils";
import config from "../util/config";
import ScheduledEmailDao from "../dao/ScheduledEmailDao";
import MeetRegistrationDao, { MeetRegistrationDaoAddOneArgs } from "../dao/MeetRegistrationDao";
import MeetRegistration from "../types/MeetRegistration";

const { disableNewMeetReminders, disableRegistrationEmail } = config;

const {
  HACKATHONS_REGISTRATION_CONFIRMATION,
  HACKATHONS_REMINDER_1,
  HACKATHONS_REMINDER_2,
  WORKSHOPS_REGISTRATION_CONFIRMATION,
  WORKSHOPS_REMINDER_1,
  WORKSHOPS_REMINDER_2,
  HACKATHONS_SUBMISSION_REMINDER_1,
  HACKATHONS_SUBMISSION_REMINDER_2,
} = EmailTemplateName;

export default class MeetService {
  constructor(
    private meetDao: MeetDao,
    private meetRegistrationDao: MeetRegistrationDao,
    private scheduledEmailDao: ScheduledEmailDao,
  ) {}

  async addOne(input: MeetDaoAddOneInput): Promise<Meet> {
    const meet = await this.meetDao.addOne(input);

    // Queue emails (fail gracefully by logging errors)

    // queue meet reminders (unless disabled)
    if (disableNewMeetReminders) {
      return meet;
    }

    const { id, startTime, endTime, meetType, region } = meet;

    const isHackathon = meetType === MeetType.Hackathon; // WORKSHOPS templates cover meet types: WORKSHOP, WEBINAR, LECTURE
    const templates = {
      reminder1: isHackathon ? HACKATHONS_REMINDER_1 : WORKSHOPS_REMINDER_1,
      reminder2: isHackathon ? HACKATHONS_REMINDER_2 : WORKSHOPS_REMINDER_2,
    };

    // queue reminder 1, only if current time is before timing of reminder 1
    try {
      const reminder1Timing = getISOString({
        targetWallclock: startTime,
        targetRegion: region,
        offset: { days: -1 },
      });

      const reminder1Time = new Date(reminder1Timing).getTime();

      const nowTime = new Date().getTime();

      if (nowTime < reminder1Time) {
        await this.scheduledEmailDao.queue({
          templateName: templates.reminder1,
          meetRecipientId: id,
          meetId: id,
          sendAt: reminder1Timing,
        });
      }
    } catch (e) {
      console.error(`Failed to queue email [reminder 1] for meet with id ${id}`, e);
    }

    // queue reminder 2 - 30 mins before meet starts
    try {
      const reminder2Timing = getISOString({
        targetWallclock: startTime,
        targetRegion: region,
        offset: { minutes: -30 },
      });
      await this.scheduledEmailDao.queue({
        templateName: templates.reminder2,
        meetRecipientId: id,
        meetId: id,
        sendAt: reminder2Timing,
      });
    } catch (e) {
      console.error(`Failed to queue email [reminder 2] for meet with id ${id}`, e);
    }

    // hackathon meets queue an additional two scheduled emails: submission reminder 1 and submission reminder 2
    if (isHackathon) {
      const durationMs = msDifference(startTime, endTime, region);
      // submission reminder 1
      // Rule: Do not queue submission reminder 1 if meet is less than 3 days long
      const MIN_DAYS_LONG = 3;
      if (durationMs > MIN_DAYS_LONG * 24 * 60 * 60 * 1000) {
        try {
          const submissionReminder1Timing = getISOString({
            targetWallclock: endTime,
            targetRegion: region,
            offset: { days: -2 },
          });
          await this.scheduledEmailDao.queue({
            templateName: HACKATHONS_SUBMISSION_REMINDER_1,
            meetRecipientId: id,
            meetId: id,
            sendAt: submissionReminder1Timing,
          });
        } catch (e) {
          console.error(`Failed to queue email [submission deadline reminder 1] for meet with id ${id}`, e);
        }
      }
      // submission reminder 2
      // 3 hours before event ends. If event is less than a day email is triggered 30 mins before event ends
      const isLongerThanADay = durationMs >= 24 * 60 * 60 * 1000;
      const offsetSubmissionReminder2 = isLongerThanADay ? { hours: -3 } : { minutes: -30 };
      try {
        const submissionReminder2Timing = getISOString({
          targetWallclock: meet.endTime,
          targetRegion: meet.region,
          offset: offsetSubmissionReminder2,
        });
        await this.scheduledEmailDao.queue({
          templateName: HACKATHONS_SUBMISSION_REMINDER_2,
          meetRecipientId: id,
          meetId: id,
          sendAt: submissionReminder2Timing,
        });
      } catch (e) {
        console.error(`Failed to queue email [submission deadline reminder 2] for meet with id ${id}`, e);
      }
    }

    return meet;
  }

  async getRegisteredMeetsOfUser(userId: string): Promise<Meet[]> {
    return this.meetDao.getMany({ registrantId: userId });
  }

  async registerForMeet({ userId, meetId }: MeetRegistrationDaoAddOneArgs): Promise<MeetRegistration> {
    const meetRegistration = await this.meetRegistrationDao.addOne({ userId, meetId });

    // Queue confirmation email

    if (disableRegistrationEmail) {
      return meetRegistration;
    }

    try {
      const meet = await this.meetDao.getOne({ id: meetId });
      if (!meet)
        throw `Failed to fetch meet with id ${meetId} when queueing confirmation email for meet registration ${meetRegistration.id}`;
      const isHackathon = meet.meetType === MeetType.Hackathon; // all non-hackathon meets (WORKSHOP, WEBINAR, LECTURE) share same template

      const template = isHackathon ? HACKATHONS_REGISTRATION_CONFIRMATION : WORKSHOPS_REGISTRATION_CONFIRMATION;

      // queue confirmation email for immediate sending
      try {
        await this.scheduledEmailDao.queue({
          templateName: template,
          userRecipientId: userId,
          meetId,
        });
      } catch (e) {
        console.log(
          `Failed to queue meet registration confirmation for meet registration with id: ${meetRegistration.id}`,
        );
      }
    } catch (e) {
      console.error(
        `Error when queueing registration confirmation email of userId: ${userId} for meetId: ${meetId}`,
        e,
      );
    }

    return meetRegistration;
  }
}
