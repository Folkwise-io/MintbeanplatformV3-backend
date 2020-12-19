import EmailApiDao from "./EmailApiDao";
import sgMail from "@sendgrid/mail";
import config from "../util/config";
import { Email } from "../types/ScheduledEmail";
import { EmailResponse, EmailResponseStatus, SendContactFormEmailInput } from "../types/gqlGeneratedTypes";

interface EmailResponseError {
  message?: string;
  // eslint-disable-next-line
  [key: string]: any;
}

const mapResponseStatus = (statusCode: number): EmailResponseStatus => {
  if (statusCode == 0) {
    return EmailResponseStatus.UnknownError;
  }
  if (statusCode < 300) {
    // Antipattern? This is currently designed for sendgrid email responses (2xx, 4xx, 5xx only)
    return EmailResponseStatus.Success;
  }
  if (statusCode < 500) {
    return EmailResponseStatus.BadRequest;
  }
  return EmailResponseStatus.ApiServerError;
};

// eslint-disable-next-line
const mapEmailApiError = (e: any, meta: { sender: string; recipient: string }): EmailResponse => {
  // Email send failed, 'e' is mostly likely an error response from Sendgrid.
  // Sendgrid throws this error object on failed send: @sendgrid/helpers/classes/response-error
  // Below is logic to transform sendgrid error into our EmailResponse type

  const statusCode = typeof e.code === "number" ? e.code : 0; // 0 for unknown error
  const status = mapResponseStatus(statusCode);
  const _responseDateStr = e.response?.headers?.date;
  const timestamp = _responseDateStr ? new Date(_responseDateStr).toISOString() : new Date().toISOString();
  const _responseErrors = e.response?.body?.errors;
  let errors = [{ message: "Unknown error occurred. Probably not a problem with the external email API" }];
  if (_responseErrors) {
    errors = _responseErrors.map((err: EmailResponseError) => {
      // stringify all non-message keys into an info string
      const infoKeys = Object.keys(err).filter((key) => key !== "message");
      const info = infoKeys.length ? infoKeys.map((key) => key + ": " + JSON.stringify(err[key])).join("; ") : null;
      return {
        message: err.message || "Unknown error ocurred.",
        info,
      };
    });
  }

  return {
    ...meta,
    statusCode,
    status,
    timestamp,
    errors,
  };
};

const { sendgridKey, contactFormRecipientEmails, senderEmail } = config;
sgMail.setApiKey(sendgridKey);

interface SendGridToEntry {
  email: string;
}
//** Parses a single string of multiple email address separated by a delimiter (default: ;) into the "to" format required by Sendgrid API */
const parseMultipleRecipients = (addressesString: string, delimiter: string = ";"): SendGridToEntry[] => {
  const addresses = addressesString.replace(/\s/, "").split(delimiter);
  return addresses.map((email) => ({
    email,
  }));
};

export default class EmailApiDaoImpl implements EmailApiDao {
  async send(email: Email): Promise<EmailResponse> {
    const meta = { recipient: email.to, sender: email.from };

    try {
      const [response] = await sgMail.send(email);
      const { statusCode } = response;
      // Email sent successfully
      return {
        ...meta,
        statusCode,
        status: mapResponseStatus(statusCode),
        timestamp: new Date(response.headers.date).toISOString(),
      };
    } catch (e) {
      return mapEmailApiError(e, meta);
    }
  }

  async sendContactFormEmail(input: SendContactFormEmailInput): Promise<EmailResponse> {
    const to = parseMultipleRecipients(contactFormRecipientEmails);
    // Must use verified email as sender, not contactor's email. Contactor's email will be in body of email.
    const meta = { sender: "foo", recipient: contactFormRecipientEmails };

    const email = {
      ...input,
      from: "foo",
      to,
    };

    try {
      const [response] = await sgMail.send(email);
      const { statusCode } = response;
      // Email sent successfully
      return {
        ...meta,
        statusCode,
        status: mapResponseStatus(statusCode),
        timestamp: new Date(response.headers.date).toISOString(),
      };
    } catch (e) {
      // Log error as this method is used directly in resolver (as opposed to in service like #send).
      const errorResponse = mapEmailApiError(e, meta);
      console.error("[EMAIL ERROR: CONTACT FORM]", errorResponse);
      return errorResponse;
    }
  }
}
