import { EmailVars, Email } from "../../../types/Email";
import { Meet } from "../../../types/gqlGeneratedTypes";
import { User } from "../../../types/User";
import AbstractEmailTemplate from "./AbstractEmailTemplate";

interface MeetRegistrationEmailVars extends EmailVars {
  user: User;
  meet: Meet;
  users: never;
  html: never;
}

export default class MeetRegistrationEmailTemplate extends AbstractEmailTemplate {
  queue(emailVars: MeetRegistrationEmailVars): Promise<void> {
    throw new Error("Method not implemented.");
  }
  generateEmail(emailVars: MeetRegistrationEmailVars): Email {
    throw new Error("Method not implemented.");
  }
}
