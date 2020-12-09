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
  HACKATHON_REGISTRATION_CONFIRM = "hackathonRegistrationConfirm",
  WORKSHOP_REGISTRATION_CONFIRM = "workshopRegistrationConfirm",
  HACKATHON_REMINDER_1 = "hackathonReminder1",
  HACKATHON_REMINDER_2 = "hackathonReminder2",
  WORKSHOP_REMINDER_1 = "workshopReminder1",
  WORKSHOP_REMINDER_2 = "workshopReminder2",
}

/** The database representation of a scheduled email */
export interface ScheduledEmail {
  id: string;
  templateName: EmailTemplateName;
  userRecipientId?: string | null;
  meetRecipientIds?: string[] | null;
  meetId?: string | null;
  sendAt: string;
  sent: boolean;
  createdAt: string;
}

/** The necessary input to create a new scheduled email */
export interface ScheduledEmailInput {
  templateName: EmailTemplateName;
  userRecipientId?: string | null;
  meetRecipientId?: string | null;
  meetId?: string | null;
  sendAt?: string;
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

export interface ScheduledEmailResponse extends EmailResponse {
  scheduledEmailId: string;
}
