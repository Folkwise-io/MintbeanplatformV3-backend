import { Meet } from "./gqlGeneratedTypes";
import { User } from "./User";

/** The email object expected by SendGrid */
export interface Email {
  to: string;
  from: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}

/** The email attachment object expected by SendGrid */
export interface Attachment {
  content: string;
  filename: string;
  type: string;
  disposition: string;
}

// Do not change the string literals after scheduleEmails has been created on staging/prod!
/** Possible names for the email templates. Each generates different html, which may be based on userId and meetId */
export enum EmailTemplateName {
  MEET_REGISTRATION = "meetRegistration",
  WELCOME = "welcome",
  CHECK_IN_AFTER_SIGN_UP = "checkInAfterSignup",
  ALL = "all",
}

/** The database representation of a scheduled email */
export interface ScheduledEmail {
  id: string;
  templateName: EmailTemplateName;
  userId?: string | null;
  meetId?: string | null;
  html?: string | null;
  sent: boolean;
  createdAt: string;
  sendAt: string;
}

/** The necessary input to create a new scheduled email */
export interface ScheduledEmailInput {
  templateName: EmailTemplateName;
  userId?: string | null;
  meetId?: string | null;
  html?: string | null;
  sendAt: string;
}

/** Variables needed to generate an email template */
export interface EmailVars {
  id: string;
  user?: User;
  users?: User[];
  meet?: Meet;
  html?: string;
}

export enum EmailResponseStatus {
  SUCCESS = "EMAIL_SUCCESS",
  REQUEST_ERROR = "EMAIL_REQUEST_ERROR",
  SERVER_ERROR = "EMAIL_SERVER_ERROR",
}

export interface EmailResponse {
  statusCode: number;
  status: EmailResponseStatus;
  errorMessage?: string;
}

/** Generates the email object according to its template and send the email depending on template needs */
export interface EmailTemplate {
  /** Generates the email object */
  generateEmail(emailVars: EmailVars): Email;

  /** Sends the emails to one or several emails, as appropriate, based on the template. Returns whether the emails were successfully sent. */
  dispatch(emailVars: EmailVars): Promise<EmailResponse[]>;
}

/** Queues email templates to the scheduledEmail db and coordinates sending of the email */
export interface EmailCommander {
  /** Adds the email as an entry to the scheduledEmails db, called upon triggering inside a controller or service */
  queue(scheduledEmail: ScheduledEmailInput | ScheduledEmailInput[]): Promise<void>;

  /** Called by the cron scheduler to coordinate generation/sending of emails. */
  dispatch(id: string, templateName: EmailTemplateName, emailVars: EmailVars): Promise<void>;
}
