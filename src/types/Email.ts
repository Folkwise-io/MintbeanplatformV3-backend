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
  html?: string;
  sendAt: string;
  sent: boolean;
  createdAt: string;
}
