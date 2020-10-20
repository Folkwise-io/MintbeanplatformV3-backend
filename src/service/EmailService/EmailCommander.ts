import EmailDao from "../../dao/EmailDao";
import {
  EmailCommander,
  EmailResponse,
  EmailTemplate,
  EmailTemplateName,
  EmailVars,
  ScheduledEmailInput,
} from "../../types/Email";
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

  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void> {
    return this.emailDao.queue(scheduledEmail);
  }

  dispatch(id: string, templateName: EmailTemplateName, emailVars: EmailVars): Promise<EmailResponse[]> {
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`ILLEGAL STATE: Template name [${template}] not implemented.`);
    }

    const emails = template.generateEmails(emailVars);
    const emailPromises = emails.map((email) => this.emailDao.sendEmail(email));
    return Promise.all(emailPromises).then(async (emailResponses) => {
      // Q: Now we need to delete the scheduledEmail entry, is it better to do it here or in cron scheduler?
      /* Q: How to decide for when to delete the entry? (i.e. wrong email address vs. sendgrid servers are down).
    I think sendgrid server errors (500 codes) = don't delete, request errors like wrong email (400 codes) = delete */
      await this.emailDao.deleteScheduledEmail(id);
      return emailResponses;
    });
  }
}
