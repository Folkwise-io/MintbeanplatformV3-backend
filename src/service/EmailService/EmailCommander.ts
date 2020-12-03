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
import HackathonRegistrationConfirmEmailTemplate from "./templates/meetRegistration/hackathon/HackathonRegistrationConfirmEmailTemplate";
import HackathonRegistrationReminder1EmailTemplate from "./templates/meetRegistration/hackathon/HackathonRegistrationReminder1EmailTemplate";
import HackathonRegistrationReminder2EmailTemplate from "./templates/meetRegistration/hackathon/HackathonRegistrationReminder2EmailTemplate";
import WorkshopRegistrationConfirmEmailTemplate from "./templates/meetRegistration/workshop/WorkshopRegistrationConfirmEmailTemplate";
import WorkshopRegistrationReminder2EmailTemplate from "./templates/meetRegistration/workshop/WorkshopRegistrationReminder2EmailTemplate";
import WorkshopRegistrationReminder1EmailTemplate from "./templates/meetRegistration/workshop/WorkshopRegistrationReminder2EmailTemplate";

const {
  HACKATHON_REGISTRATION_CONFIRM,
  HACKATHON_REGISTRATION_REMINDER_1,
  HACKATHON_REGISTRATION_REMINDER_2,
  WORKSHOP_REGISTRATION_CONFIRM,
  WORKSHOP_REGISTRATION_REMINDER_1,
  WORKSHOP_REGISTRATION_REMINDER_2,
} = EmailTemplateName;
export default class EmailCommanderImpl implements EmailCommander {
  constructor(private emailDao: EmailDao, private userDao: UserDao, private meetDao: MeetDao) {}

  templates: {
    [key in EmailTemplateName]: EmailTemplate;
  } = {
    [HACKATHON_REGISTRATION_CONFIRM]: new HackathonRegistrationConfirmEmailTemplate(this.userDao, this.meetDao),
    [HACKATHON_REGISTRATION_REMINDER_1]: new HackathonRegistrationReminder1EmailTemplate(this.userDao, this.meetDao),
    [HACKATHON_REGISTRATION_REMINDER_2]: new HackathonRegistrationReminder2EmailTemplate(this.userDao, this.meetDao),
    [WORKSHOP_REGISTRATION_CONFIRM]: new WorkshopRegistrationConfirmEmailTemplate(this.userDao, this.meetDao),
    [WORKSHOP_REGISTRATION_REMINDER_1]: new WorkshopRegistrationReminder1EmailTemplate(this.userDao, this.meetDao),
    [WORKSHOP_REGISTRATION_REMINDER_2]: new WorkshopRegistrationReminder2EmailTemplate(this.userDao, this.meetDao),
    // [WELCOME]: new MeetRegistrationEmailTemplate(this.userDao, this.meetDao),
    // [ALL]: new MeetRegistrationEmailTemplate(this.userDao, this.meetDao),
    // [CHECK_IN_AFTER_SIGN_UP]: new MeetRegistrationEmailTemplate(this.userDao, this.meetDao),
  };

  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void> {
    return this.emailDao.queue(scheduledEmail);
  }

  getOverdueScheduledEmails(): Promise<ScheduledEmail[]> {
    return this.emailDao.getOverdueScheduledEmails();
  }

  dispatch = (scheduledEmail: ScheduledEmail): Promise<EmailResponse[]> => {
    const { templateName, id } = scheduledEmail;
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`ILLEGAL STATE: Template name [${template}] not implemented.`);
    }

    return template
      .inflateVars(scheduledEmail)
      .then(template.generateEmails)
      .then((emails) => emails.map(this.emailDao.sendEmail))
      .then((emailResponsePromises) => Promise.all(emailResponsePromises))
      .then(async (emailResponses) => {
        // Q: Now we need to delete the scheduledEmail entry, is it better to do it here or in cron scheduler?
        /* Q: How to decide for when to delete the entry? (i.e. wrong email address vs. sendgrid servers are down).
      I think sendgrid server errors (500 codes) = don't delete, request errors like wrong email (400 codes) = delete */

        // TODO: write logic that checks emailResponses to decide when to delete the scheduled email from entry
        await this.emailDao.markAsSent(id);
        return emailResponses;
      });
  };
}
