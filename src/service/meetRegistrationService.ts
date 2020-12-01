import MeetRegistrationDao, { MeetRegistrationDaoAddOneArgs } from "../dao/MeetRegistrationDao";
import { EmailCommander, EmailTemplateName, ScheduledEmailInput } from "../types/Email";
import MeetRegistration from "../types/MeetRegistration";
import config from "../util/config";

const { disableRegistrationEmail } = config;
const { MEET_REGISTRATION } = EmailTemplateName;

export default class MeetRegistrationService {
  constructor(private meetRegistrationDao: MeetRegistrationDao, private emailCommander: EmailCommander) {}

  async addOne(args: MeetRegistrationDaoAddOneArgs): Promise<MeetRegistration> {
    // register for meet
    const meetRegistration = await this.meetRegistrationDao.addOne(args);

    // queue emails
    const { userId, meetId } = args;

    // if (!disableRegistrationEmail) {
    // 1. confirmation (immediate)
    const confirmationEmail: ScheduledEmailInput = {
      templateName: MEET_REGISTRATION,
      userId,
      meetId,
      sendAt: new Date().toISOString(),
    };
    // 2. reminder 1 (T-24 hr)
    //   const reminder1: ScheduledEmailInput = {
    //     templateName: MEET_REGISTRATION,
    //     userId,
    //     meetId,
    //     sendAt: new Date().toISOString(),
    //   };

    //   // 3. reminder 2 (T-30 min)
    //   const reminder2: ScheduledEmailInput = {
    //     templateName: MEET_REGISTRATION,
    //     userId,
    //     meetId,
    //     sendAt: new Date().toISOString(),
    //   };

    //   await this.emailCommander.queue([confirmationEmail, reminder1, reminder2]);
    await this.emailCommander.queue(confirmationEmail);
    // }

    return meetRegistration;
  }
}
