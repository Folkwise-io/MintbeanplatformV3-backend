import MeetDao from "../dao/MeetDao";
import MeetRegistrationDao, { MeetRegistrationDaoAddOneArgs } from "../dao/MeetRegistrationDao";
import { EmailCommander, EmailTemplateName, ScheduledEmailInput } from "../types/Email";
import { Meet } from "../types/gqlGeneratedTypes";
import MeetRegistration from "../types/MeetRegistration";
import config from "../util/config";
import { ensureExists } from "../util/ensureExists";

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
      let confirmationEmail: ScheduledEmailInput;
      let reminder1: ScheduledEmailInput;
      let reminder2: ScheduledEmailInput;
      // TODO: align meetTypes with Celeste's new branch - currently 'hackMeet' but will become 'hackathon'
      if (meet.meetType === "hackMeet") {
        // TODO: refactor the templating of these emails to a single method since they all take same params
        confirmationEmail = {
          templateName: HACKATHON_REGISTRATION_CONFIRM,
          userId,
          meetId,
          sendAt: new Date().toISOString(),
        };
        // 2. reminder 1 (T-24 hr)
        reminder1 = {
          templateName: HACKATHON_REGISTRATION_REMINDER_1,
          userId,
          meetId,
          // TODO: calculate sendAt time
          sendAt: new Date().toISOString(),
        };

        // 3. reminder 2 (T-30 min)
        reminder2 = {
          templateName: HACKATHON_REGISTRATION_REMINDER_2,
          userId,
          meetId,
          // TODO: calculate sendAt time
          sendAt: new Date().toISOString(),
        };
      } else {
        // TODO: refactor the templating of these emails to a single method since they all take same params
        confirmationEmail = {
          templateName: WORKSHOP_REGISTRATION_CONFIRM,
          userId,
          meetId,
          sendAt: new Date().toISOString(),
        };
        // 2. reminder 1 (T-24 hr)
        reminder1 = {
          templateName: WORKSHOP_REGISTRATION_REMINDER_1,
          userId,
          meetId,
          // TODO: calculate sendAt time
          sendAt: new Date().toISOString(),
        };

        // 3. reminder 2 (T-30 min)
        reminder2 = {
          templateName: WORKSHOP_REGISTRATION_REMINDER_2,
          userId,
          meetId,
          // TODO: calculate sendAt time
          sendAt: new Date().toISOString(),
        };
      }

      await this.emailCommander.queue([confirmationEmail, reminder1, reminder2]);
    }

    return meetRegistration;
  }
}
