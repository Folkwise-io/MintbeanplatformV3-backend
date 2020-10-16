import { EmailDao } from "../../../dao/EmailDao";
import { EmailVars, Email, EmailTemplate } from "../../../types/Email";
import { Meet } from "../../../types/gqlGeneratedTypes";
import { User } from "../../../types/User";

interface MeetReminderEmailVars extends EmailVars {
  user: User;
  meet: Meet;
  users: User[];
  html: never;
}

export default class MeetReminderEmailTemplate implements EmailTemplate {
  constructor(emailDao: EmailDao) {}

  queue(emailVars: MeetReminderEmailVars): Promise<void> {
    throw new Error("Method not implemented.");
  }

  generateEmail(emailVars: MeetReminderEmailVars): Email {
    throw new Error("Method not implemented.");
  }

  dispatch(emailVars: MeetReminderEmailVars): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
