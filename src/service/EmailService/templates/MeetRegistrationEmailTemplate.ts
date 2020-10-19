import { EmailDao } from "../../../dao/EmailDao";
import { EmailVars, Email, EmailTemplate, EmailTemplateName } from "../../../types/Email";
import { Meet } from "../../../types/gqlGeneratedTypes";
import { User } from "../../../types/User";

interface MeetRegistrationEmailVars extends EmailVars {
  user: User;
  meet: Meet;
  users: never;
  html: never;
}

export default class MeetRegistrationEmailTemplate implements EmailTemplate {
  constructor(private emailDao: EmailDao) {}

  generateEmail(emailVars: MeetRegistrationEmailVars): Email {
    throw new Error("Method not implemented.");
  }

  dispatch(emailVars: MeetRegistrationEmailVars): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
