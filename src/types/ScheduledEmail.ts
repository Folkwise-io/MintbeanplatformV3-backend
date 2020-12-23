import { User } from "./User";
import { EmailResponseStatus, Meet } from "./gqlGeneratedTypes";

/** Named email templates pointing to template paths */
export enum EmailTemplateName {
  HACKATHONS_REGISTRATION_CONFIRMATION = "hackathons/registration-confirmation",
  HACKATHONS_REMINDER_1 = "hackathons/reminder-1",
  HACKATHONS_REMINDER_2 = "hackathons/reminder-2",
  HACKATHONS_SUBMISSION_REMINDER_1 = "hackathons/submission-reminder-1",
  HACKATHONS_SUBMISSION_REMINDER_2 = "hackathons/submission-reminder-2",
  WORKSHOPS_REGISTRATION_CONFIRMATION = "workshops/registration-confirmation",
  WORKSHOPS_REMINDER_1 = "workshops/reminder-1",
  WORKSHOPS_REMINDER_2 = "workshops/reminder-2",
}

//** Common to all ScheduledEmail types */
export interface ScheduledEmailBase {
  id: string;
  templateName: EmailTemplateName;
  retriesLeft: number;
}

//** Scheduled email fresh out of the database. Recipients are not resolved */
export interface ScheduledEmailRaw extends ScheduledEmailBase {
  userRecipientId?: string | null;
  meetRecipientId?: string | null;
  meetId?: string | null;
}

// ** Contains resolved recipients inflated variables */
export interface ScheduledEmail extends ScheduledEmailBase {
  recipients?: User[] | null;
  meet?: Meet | null;
}

// ** Input shape when queueing a scheduledEmail */
export interface ScheduledEmailInput {
  templateName: EmailTemplateName;
  userRecipientId?: string | null;
  meetRecipientId?: string | null;
  meetId?: string | null;
  sendAt?: string | null; // ISO string (with 'Z'). defaults to now
  retriesLeft?: number | null;
}

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

// Note: EmailResponse type was moved to generatedTypes (see 'email' typedef)
