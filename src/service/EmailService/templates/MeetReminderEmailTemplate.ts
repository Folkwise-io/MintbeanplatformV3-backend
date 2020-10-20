import EmailDao from "../../../dao/EmailDao";
import { EmailVars, Email, EmailTemplate, EmailResponse } from "../../../types/Email";
import { Meet } from "../../../types/gqlGeneratedTypes";
import { User } from "../../../types/User";

interface MeetReminderEmailVars extends EmailVars {
  user: User;
  meet: Meet;
  users: User[];
  html: never;
}

export default class MeetReminderEmailTemplate implements EmailTemplate {
  constructor(private emailDao: EmailDao) {}

  generateEmail(emailVars: MeetReminderEmailVars): Email {
    throw new Error("Method not implemented.");
  }

  dispatch(emailVars: MeetReminderEmailVars): Promise<EmailResponse[]> {
    throw new Error("Method not implemented.");
  }
}
