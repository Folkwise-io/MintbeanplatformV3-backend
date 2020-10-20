import EmailDao from "../../dao/EmailDao";
import MeetDao from "../../dao/MeetDao";
import UserDao from "../../dao/UserDao";
import {
  EmailCommander,
  EmailResponse,
  EmailTemplate,
  EmailTemplateName,
  EmailVars,
  ScheduledEmail,
  ScheduledEmailInput,
} from "../../types/Email";
import MeetRegistrationEmailTemplate from "./templates/MeetRegistrationEmailTemplate";
import MeetReminderEmailTemplate from "./templates/MeetReminderEmailTemplate";

const { MEET_REGISTRATION, MEET_REMINDER, WELCOME, ALL, CHECK_IN_AFTER_SIGN_UP } = EmailTemplateName;
export default class EmailCommanderImpl implements EmailCommander {
  constructor(private emailDao: EmailDao, private userDao: UserDao, private meetDao: MeetDao) {}

  templates: {
    [key in EmailTemplateName]: EmailTemplate;
  } = {
    [MEET_REGISTRATION]: new MeetRegistrationEmailTemplate(this.userDao, this.meetDao),
    [MEET_REMINDER]: new MeetReminderEmailTemplate(this.userDao, this.meetDao),
    [WELCOME]: new MeetRegistrationEmailTemplate(this.userDao, this.meetDao),
    [ALL]: new MeetRegistrationEmailTemplate(this.userDao, this.meetDao),
    [CHECK_IN_AFTER_SIGN_UP]: new MeetRegistrationEmailTemplate(this.userDao, this.meetDao),
  };

  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void> {
    return this.emailDao.queue(scheduledEmail);
  }

  getOverdueScheduledEmails(): Promise<ScheduledEmail[]> {
    return this.emailDao.getOverdueScheduledEmails();
  }

  dispatch(scheduledEmail: ScheduledEmail): Promise<EmailResponse[]> {
    const { templateName, id } = scheduledEmail;
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`ILLEGAL STATE: Template name [${template}] not implemented.`);
    }

    return template
      .inflateVars(scheduledEmail)
      .then((emailVars) => template.generateEmails(emailVars))
      .then((emails) => emails.map((email) => this.emailDao.sendEmail(email)))
      .then((emailPromises) => Promise.all(emailPromises))
      .then(async (emailResponses) => {
        // Q: Now we need to delete the scheduledEmail entry, is it better to do it here or in cron scheduler?
        /* Q: How to decide for when to delete the entry? (i.e. wrong email address vs. sendgrid servers are down).
      I think sendgrid server errors (500 codes) = don't delete, request errors like wrong email (400 codes) = delete */
        await this.emailDao.deleteScheduledEmail(id);
        return emailResponses;
      });
  }
}
