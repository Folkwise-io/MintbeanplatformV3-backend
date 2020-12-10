import ResponseError from "@sendgrid/helpers/classes/response-error";
import { ClientResponse } from "@sendgrid/client/src/response";

// today: move all to jobs world, except for ScheduledEmail
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

export interface ScheduledEmail {
  id: string;
  sendAt: string;
  sent: boolean;
  // TODO: properties below will change when scheduledEmails table structure changes
  to: string;
  from: string;
  subject: string;
  html: string;
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
  // scheduledEmailId: string;
  recipient: string;
  sender: string;
  statusCode: number;
  status: EmailResponseStatus;
  // response: ClientResponse;
  timestamp: string;
  errors?: {
    message: string;
    info?: string;
  }[];
}
