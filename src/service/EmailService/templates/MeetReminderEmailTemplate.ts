import MeetDao from "../../../dao/MeetDao";
import UserDao from "../../../dao/UserDao";
import { EmailVars, Email, EmailTemplate, EmailResponse, ScheduledEmail } from "../../../types/Email";
import { Meet } from "../../../types/gqlGeneratedTypes";
import { User } from "../../../types/User";

interface MeetReminderEmailVars extends EmailVars {
  user: never;
  meet: Meet;
  users: User[];
  html: never;
}

export default class MeetReminderEmailTemplate implements EmailTemplate {
  constructor(private userDao: UserDao, private meetDao: MeetDao) {}
  inflateVars(scheduledEmail: ScheduledEmail): Promise<MeetReminderEmailVars> {
    throw new Error("Method not implemented.");
  }

  generateEmails(emailVars: MeetReminderEmailVars): Email[] {
    throw new Error("Method not implemented.");
  }

  dispatch(emailVars: MeetReminderEmailVars): Promise<EmailResponse[]> {
    throw new Error("Method not implemented.");
  }
}
