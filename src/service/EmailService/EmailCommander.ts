import EmailDao from "../../dao/EmailDao";
import { EmailCommander, EmailTemplate, EmailTemplateName, EmailVars, ScheduledEmail } from "../../types/Email";
import MeetRegistrationEmailTemplate from "./templates/MeetRegistrationEmailTemplate";

const { MEET_REGISTRATION, WELCOME, ALL, CHECK_IN_AFTER_SIGN_UP } = EmailTemplateName;
export default class EmailCommanderImpl implements EmailCommander {
  constructor(private emailDao: EmailDao) {}

  templates: {
    [key in EmailTemplateName]: EmailTemplate;
  } = {
    [MEET_REGISTRATION]: new MeetRegistrationEmailTemplate(this.emailDao),
    [WELCOME]: new MeetRegistrationEmailTemplate(this.emailDao),
    [ALL]: new MeetRegistrationEmailTemplate(this.emailDao),
    [CHECK_IN_AFTER_SIGN_UP]: new MeetRegistrationEmailTemplate(this.emailDao),
  };

  queue(scheduledEmailVars: ScheduledEmail): Promise<void> {
    return this.emailDao.queue(scheduledEmailVars);
  }

  dispatch(id: string, templateName: EmailTemplateName, emailVars: EmailVars): Promise<void> {
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`ILLEGAL STATE: Template name [${template}] not implemented.`);
    }

    return template.dispatch(emailVars).then(() => this.emailDao.deleteScheduledEmail(id));
  }
}
