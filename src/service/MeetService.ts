import MeetDao, { MeetDaoAddOneInput } from "../dao/MeetDao";
import meet from "../graphql/typedef/meet";
import { Meet, MeetType } from "../types/gqlGeneratedTypes";
import { EmailTemplateName } from "../types/ScheduledEmail";
import { getISOString } from "../util/timeUtils";
import config from "../util/config";
import ScheduledEmailDao from "../dao/ScheduledEmailDao";

const { disableNewMeetReminders, disableRegistrationEmail } = config;

export default class MeetService {
  constructor(private meetDao: MeetDao, private scheduledEmailDao: ScheduledEmailDao) {}
  async addOne(input: MeetDaoAddOneInput): Promise<Meet> {
    const meet = await this.meetDao.addOne(input);

    // queue meet reminders (unless disabled)
    if (disableNewMeetReminders) {
      return meet;
    }

    const meetId = meet.id;

    const isHackathon = meet.meetType === MeetType.Hackathon; // WORKSHOPS templates cover meet types: WORKSHOP, WEBINAR, LECTURE
    const templates = {
      reminder1: isHackathon ? EmailTemplateName.HACKATHONS_REMINDER_1 : EmailTemplateName.WORKSHOPS_REMINDER_1,
      reminder2: isHackathon ? EmailTemplateName.HACKATHONS_REMINDER_2 : EmailTemplateName.WORKSHOPS_REMINDER_2,
    };

    // queue reminder 1, only if current time is before timing of reminder 1
    try {
      const reminder1Timing = getISOString({
        targetWallclock: meet.startTime,
        targetRegion: meet.region,
        offset: { days: -1 },
      });

      const reminder1Time = new Date(reminder1Timing).getTime();

      const nowTime = new Date().getTime();

      if (nowTime < reminder1Time) {
        await this.scheduledEmailDao.queue({
          templateName: templates.reminder1,
          meetRecipientId: meetId,
          meetId,
          sendAt: reminder1Timing,
        });
      }
    } catch (e) {
      console.error(`Failed to queue email [reminder 1] for meet with id ${meetId}`, e);
    }

    // queue reminder 2 - 30 mins before meet starts
    try {
      const reminder2Timing = getISOString({
        targetWallclock: meet.startTime,
        targetRegion: meet.region,
        offset: { minutes: -30 },
      });
      await this.scheduledEmailDao.queue({
        templateName: templates.reminder2,
        meetRecipientId: meetId,
        meetId,
        sendAt: reminder2Timing,
      });
    } catch (e) {
      console.error(`Failed to queue email [reminder 2] for meet with id ${meetId}`, e);
    }

    return meet;
  }

  async getRegisteredMeetsOfUser(userId: string): Promise<Meet[]> {
    return this.meetDao.getMany({ registrantId: userId });
  }
}
