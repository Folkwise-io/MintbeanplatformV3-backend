export interface Email {
  to: string;
  from: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}

export interface Attachment {
  content: string;
  filename: string;
  type: string;
  disposition: string;
}

// Do not change the string literals after scheduleEmails has been created on staging/prod
export enum EmailTemplateName {
  MEET_REGISTRATION = "meetRegistration",
  WELCOME = "welcome",
  CHECK_IN_AFTER_SIGN_UP = "checkInAfterSignup",
  ALL = "all",
}

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
