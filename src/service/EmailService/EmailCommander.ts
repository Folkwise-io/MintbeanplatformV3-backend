import { EmailDao } from "../../dao/EmailDao";
import { EmailTemplate, EmailTemplateName, EmailVars } from "../../types/Email";
import MeetRegistrationEmailTemplate from "./templates/MeetRegistrationEmailTemplate";

const { MEET_REGISTRATION, WELCOME, ALL, CHECK_IN_AFTER_SIGN_UP } = EmailTemplateName;
export default class EmailCommander {
  constructor(private emailDao: EmailDao) {}
  templates: {
    [key in EmailTemplateName]: EmailTemplate;
  } = {
    [MEET_REGISTRATION]: new MeetRegistrationEmailTemplate(),
    [WELCOME]: new MeetRegistrationEmailTemplate(),
    [ALL]: new MeetRegistrationEmailTemplate(),
    [CHECK_IN_AFTER_SIGN_UP]: new MeetRegistrationEmailTemplate(),
  };

  // This is called upon triggering inside a controller or service
  queue(templateName: EmailTemplateName, emailVars: EmailVars) {
    this.emailDao.queue(templateName, emailVars);
  }

  // This is called by the cron scheduler
  async dispatch(id: string, templateName: EmailTemplateName, emailVars: EmailVars) {
    const template = this.templates[templateName];
    const email = template.generateEmail(emailVars);
    this.emailDao.sendEmail(email);
    this.emailDao.deleteScheduledEmail(id);
  }
}
