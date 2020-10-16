import { EmailVars, Email } from "../../../types/Email";
import AbstractEmailTemplate from "./AbstractEmailTemplate";

interface MeetRegistrationEmailVars extends EmailVars {
  userId: string;
  meetId: string;
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
