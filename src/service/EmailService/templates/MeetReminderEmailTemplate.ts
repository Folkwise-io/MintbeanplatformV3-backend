import { EmailVars, Email } from "../../../types/Email";
import { Meet } from "../../../types/gqlGeneratedTypes";
import { User } from "../../../types/User";
import AbstractEmailTemplate from "./AbstractEmailTemplate";

interface MeetReminderEmailVars extends EmailVars {
  user: never;
  meet: Meet;
  users: User[];
  html: never;
}

export default class MeetReminderEmailTemplate extends AbstractEmailTemplate {
  queue(emailVars: MeetReminderEmailVars): Promise<void> {
    throw new Error("Method not implemented.");
  }

  generateEmail(emailVars: MeetReminderEmailVars): Email {
    throw new Error("Method not implemented.");
  }
}
