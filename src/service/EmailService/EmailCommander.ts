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
import { Meet } from "../../types/gqlGeneratedTypes";
import { User } from "../../types/User";
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

interface EmailContext {
  meet: Meet;
  user: User;
}
export default class EmailCommanderImpl implements EmailCommander {
  constructor(private emailDao: EmailDao, private userDao: UserDao, private meetDao: MeetDao) {}

  // templates: {
  //   [key in EmailTemplateName]: EmailTemplate;
  // } = {
  //   [HACKATHON_REGISTRATION_CONFIRM]: new HackathonRegistrationConfirmEmailTemplate(this.userDao, this.meetDao),
  //   [HACKATHON_REGISTRATION_REMINDER_1]: new HackathonRegistrationReminder1EmailTemplate(this.userDao, this.meetDao),
  //   [HACKATHON_REGISTRATION_REMINDER_2]: new HackathonRegistrationReminder2EmailTemplate(this.userDao, this.meetDao),
  //   [WORKSHOP_REGISTRATION_CONFIRM]: new WorkshopRegistrationConfirmEmailTemplate(this.userDao, this.meetDao),
  //   [WORKSHOP_REGISTRATION_REMINDER_1]: new WorkshopRegistrationReminder1EmailTemplate(this.userDao, this.meetDao),
  //   [WORKSHOP_REGISTRATION_REMINDER_2]: new WorkshopRegistrationReminder2EmailTemplate(this.userDao, this.meetDao),
  //   // [WELCOME]: new MeetRegistrationEmailTemplate(this.userDao, this.meetDao),
  //   // [ALL]: new MeetRegistrationEmailTemplate(this.userDao, this.meetDao),
  //   // [CHECK_IN_AFTER_SIGN_UP]: new MeetRegistrationEmailTemplate(this.userDao, this.meetDao),
  // };

  templateFilenames: {
    [key in EmailTemplateName]: string;
  } = {
    [HACKATHON_REGISTRATION_CONFIRM]: {
      titleBuilder: (emailContext: any) => `Thanks for registering for ${emailContext.meet.title}`,
      htmlBuilder: (emailContext: any) => "HackathonRegistrationConfirm.mustache",
    },
    // TODO: make these templates below and update filepath
    [HACKATHON_REGISTRATION_REMINDER_1]: "HackathonRegistrationConfirm.mustache",
    [HACKATHON_REGISTRATION_REMINDER_2]: "HackathonRegistrationConfirm.mustache",
    [WORKSHOP_REGISTRATION_CONFIRM]: "HackathonRegistrationConfirm.mustache",
    [WORKSHOP_REGISTRATION_REMINDER_1]: "HackathonRegistrationConfirm.mustache",
    [WORKSHOP_REGISTRATION_REMINDER_2]: "HackathonRegistrationConfirm.mustache",
  };

  templateExample: any = {
    [HACKATHON_REGISTRATION_CONFIRM]: {
      titleBuilder: (emailContext: any) => `Hello ${emailContext.user.firstName}, welcome to the hackathon!`,
      template: "hackathons/registrationConfirm.mustache",
    },
  };

  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<ScheduledEmail> {
    // using the daos, get database entities here
    return this.emailDao.queue(scheduledEmail);
  }

  getOverdueScheduledEmails(): Promise<ScheduledEmail[]> {
    return this.emailDao.getOverdueScheduledEmails();
  }

  dispatch = async (scheduledEmail: ScheduledEmail): Promise<EmailResponse[]> => {
    const { templateName, id } = scheduledEmail;
    const template = this.templates[templateName];
    if (!template) {
      throw new Error(`ILLEGAL STATE: Template name [${template}] not implemented.`);
    }

    // create email context
    // const emailContext = {
    //   user:
    // }

    const inflated = await template.inflateVars(scheduledEmail);
    const emails = await template.generateEmails(inflated);

    return template
      .inflateVars(scheduledEmail)
      .then(template.generateEmails)
      .then((emails) => emails.map(this.emailDao.sendEmail))
      .then((emailResponsePromises) => Promise.all(emailResponsePromises))
      .then(async (emailResponses) => {
        // Q: Now we need to delete the scheduledEmail entry, is it better to do it here or in cron scheduler?
        /* Q: How to decide for when to delete the entry? (i.e. wrong email address vs. sendgrid servers are down).
      I think sendgrid server errors (500 codes) = don't delete, request errors like wrong email (400 codes) = delete */
        console.log({ emailResponses });
        // const successes = (emailResponses.filter(
        //   (x) => x.status === "fulfilled",
        // ) as unknown) as PromiseFulfilledResult<EmailResponse>[];
        // const failures = (emailResponses.filter((x) => x.status === "rejected") as unknown) as PromiseRejectedResult[];

        // failures.forEach((failure) => console.log(failure.reason));

        // const deletePromises = successes.map((x) => new Promise(this.emailDao.deleteOne(x.id)));
        // const deleteResults = ((await Promise.allSettled(
        //   deletePromises,
        // )) as unknown) as PromiseSettledResult<EmailResponse>[];

        // const deleteFailures = deleteResults.filter((x) => x.status === "rejected") as PromiseRejectedResult[];

        // deleteFailures.forEach((failure) => console.log(failure.reason));

        // TODO: write logic that checks emailResponses to decide when to delete the scheduled email from entry
        await this.emailDao.markAsSent(id);
        return emailResponses;
      });
  };
}
