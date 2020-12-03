import MeetDao from "../../../../../dao/MeetDao";
import UserDao from "../../../../../dao/UserDao";
import { EmailVars, EmailTemplate, ScheduledEmail, Email, EmailResponse } from "../../../../../types/Email";
import { Meet } from "../../../../../types/gqlGeneratedTypes";
import { User } from "../../../../../types/User";
import config from "../../../../../util/config";
import { generateJsonLdHtml, generateIcsAttachments } from "../../../../../util/emailUtils";
import { ensureExists } from "../../../../../util/ensureExists";

const { senderEmail } = config;

interface WorkshopRegistrationReminder2EmailVars extends EmailVars {
  user: User;
  meet: Meet;
  users?: never;
  html?: never;
}

export default class WorkshopRegistrationReminder2EmailTemplate implements EmailTemplate {
  constructor(private userDao: UserDao, private meetDao: MeetDao) {}

  ensureVars(scheduledEmail: ScheduledEmail) {
    const { id, userId, meetId } = scheduledEmail;
    if (!(userId && meetId)) {
      throw new Error(`ILLEGAL STATE: scheduledEmail id=${id} (Meet Registration) does not have required fields`);
    }
    return { ...scheduledEmail, userId, meetId };
  }

  async inflateVars(scheduledEmail: ScheduledEmail): Promise<WorkshopRegistrationReminder2EmailVars> {
    const { id, userId, meetId } = this.ensureVars(scheduledEmail);
    const user = (await this.userDao.getOne({ id: userId })) as User;
    const meet = (await this.meetDao.getOne({ id: meetId })) as Meet;
    ensureExists("User")(user);
    ensureExists("Meet")(meet);
    return { id, user, meet };
  }

  generateEmails(emailVars: WorkshopRegistrationReminder2EmailVars): Email[] {
    const { user, meet, id } = emailVars;
    const { title } = meet;
    const email: Email = {
      to: user.email,
      from: senderEmail,
      // TODO: update email body/subject
      subject: `Workshop starts in 30 mins! ${title}`,
      html: `<strong>${title}</strong> is about to start in 30mins!`,
      attachments: generateIcsAttachments(meet),
    };

    return [email];
  }

  dispatch(emailVars: WorkshopRegistrationReminder2EmailVars): Promise<EmailResponse[]> {
    throw new Error("Method not implemented.");
  }
}
