import { User } from "./User";
import { Meet } from "./gqlGeneratedTypes";

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

// TODO: move all types below in this file to jobs world as Email types
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

/** Covers possible response codes from email API. Sendgrid only returns: 2xx, 4xx, or 5xx.
See https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/errors.html */
export enum EmailResponseStatus {
  SUCCESS = "SUCCESS",
  BAD_REQUEST = "BAD_REQUEST",
  API_SERVER_ERROR = "API_SERVER_ERROR", // sendgrid's fault
  UNKNOWN_ERROR = "UNKOWN_ERROR",
}

//** Normalized API response for sunny/bad scenarios */
export interface EmailResponse {
  recipient: string;
  sender: string;
  statusCode: number;
  status: EmailResponseStatus;
  timestamp: string;
  errors?: {
    message: string;
    info?: string;
  }[];
}
