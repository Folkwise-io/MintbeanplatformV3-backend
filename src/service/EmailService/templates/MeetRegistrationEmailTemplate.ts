import MeetDao from "../../../dao/MeetDao";
import UserDao from "../../../dao/UserDao";
import { EmailVars, Email, EmailTemplate, EmailResponse, ScheduledEmail } from "../../../types/Email";
import { Meet } from "../../../types/gqlGeneratedTypes";
import { User } from "../../../types/User";
import config from "../../../util/config";
import { generateJsonLdHtml, generateIcsAttachments } from "../../../util/emailUtils";
import { ApolloError } from "apollo-server-express";

const { senderEmail } = config;

interface MeetRegistrationEmailVars extends EmailVars {
  user: User;
  meet: Meet;
  users?: never;
  html?: never;
}

export default class MeetRegistrationEmailTemplate implements EmailTemplate {
  constructor(private userDao: UserDao, private meetDao: MeetDao) {}

  ensureVars(scheduledEmail: ScheduledEmail) {
    const { id, userId, meetId } = scheduledEmail;
    if (!(userId && meetId)) {
      throw new Error(`ILLEGAL STATE: scheduledEmail id=${id} (Meet Registration) does not have required fields`);
    }
    return { ...scheduledEmail, userId, meetId };
  }

  async inflateVars(scheduledEmail: ScheduledEmail): Promise<MeetRegistrationEmailVars> {
    const { id, userId, meetId } = this.ensureVars(scheduledEmail);
    const user = (await this.userDao.getOne({ id: userId })) as User;
    const meet = (await this.meetDao.getOne({ id: meetId })) as Meet;
    return { id, user, meet };
  }

  generateEmails(emailVars: MeetRegistrationEmailVars): Email[] {
    const { user, meet, id } = emailVars;
    const { title } = meet;
    const email: Email = {
      to: user.email,
      from: senderEmail,
      subject: `Registration Confirmation for ${title}`,
      html: generateJsonLdHtml(user, meet, id),
      attachments: generateIcsAttachments(meet),
    };

    return [email];
  }

  dispatch(emailVars: MeetRegistrationEmailVars): Promise<EmailResponse[]> {
    throw new Error("Method not implemented.");
  }
}
