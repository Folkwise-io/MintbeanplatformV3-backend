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

/** Variables needed to generate an email template */
export interface EmailVars {
  user?: User;
  users?: User[];
  meet?: Meet;
  html?: string;
}

/** A class that can queue itself to the scheduledEmail db, generate the email object, and send the email */
export interface EmailTemplate {
  /** Adds the email as an entry to the scheduledEmails db */
  queue(emailVars: EmailVars): Promise<void>;

  /** Generates the email object */
  generateEmail(emailVars: EmailVars): Email;

  /** Sends the email */
  sendEmail(email: Email): Promise<void>;
}
