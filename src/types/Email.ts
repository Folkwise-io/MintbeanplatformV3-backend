import ResponseError from "@sendgrid/helpers/classes/response-error";
import { ClientResponse } from "@sendgrid/client/src/response";
import { User } from "./User";
import { Meet } from "./gqlGeneratedTypes";

// don't need sendAt yet - implied the email is ready for sending when retrieved via `scheduledAEmailDao.getOverdueScheduledEmails()`
export enum EmailTemplateName {
  HACKATHON_REGISTRATION_CONFIRM = "HACKATHON_REGISTRATION_CONFIRM",
}

export interface ScheduledEmail {
  id: string;
  templateName: EmailTemplateName;
  userRecipient?: User | null;
  meetRecipient?: Meet | null; // can get recipients via meet.registrants
  meet?: Meet | null;
  // in step 3:
  // icsStart: string | null; // nullable
  // icsDurationMins: number | null; //
  // icsEnd: string | null;
}
export interface ScheduledEmailInput {
  templateName: EmailTemplateName;
  userRecipientId?: string | null;
  meetRecipientId?: string | null; // can get recipients via meet.registrants
  meetId?: string | null;
  sendAt?: string | null; // ISO string (with 'Z'). defaults to now
  // in step 3:
  // icsStart: string | null; // nullable
  // icsDurationMins: number | null; //
  // icsEnd: string | null;
}

// today: move all types below in this file to jobs world
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
