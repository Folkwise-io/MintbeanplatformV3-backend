import { Email, EmailResponse, EmailResponseStatus } from "../types/ScheduledEmail";

import EmailApiDao from "./EmailApiDao";
import sgMail from "@sendgrid/mail";
import config from "../util/config";

interface EmailResponseError {
  message?: string;
  // eslint-disable-next-line
  [key: string]: any;
}

const { sendgridKey } = config;
sgMail.setApiKey(sendgridKey);

const mapResponseStatus = (statusCode: number): EmailResponseStatus => {
  if (statusCode == 0) {
    return EmailResponseStatus.UNKNOWN_ERROR;
  }
  if (statusCode < 300) {
    // Antipattern? This is currently designed for sendgrid email responses (2xx, 4xx, 5xx only)
    return EmailResponseStatus.SUCCESS;
  }
  if (statusCode < 500) {
    return EmailResponseStatus.BAD_REQUEST;
  }
  return EmailResponseStatus.API_SERVER_ERROR;
};

// TODO: move this Dao to jobs world
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
      // Email send failed
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
    }
  }
}

// example sendgrid response objects:

// CASE: FAILED

//   [response: {
//     headers: {
//       server: 'nginx',
//       date: 'Wed, 09 Dec 2020 19:08:40 GMT',
//       'content-type': 'application/json',
//       'content-length': '185',
//       connection: 'close',
//       'access-control-allow-origin': 'https://sendgrid.api-docs.io',
//       'access-control-allow-methods': 'POST',
//       'access-control-allow-headers': 'Authorization, Content-Type, On-behalf-of, x-sg-elas-acl',
//       'access-control-max-age': '600',
//       'x-no-cors-reason': 'https://sendgrid.com/docs/Classroom/Basics/API/cors.html'
//     },
//     body: { errors: [Array] }
//   },
//   errors: [
//     {
//       message: 'The from email does not contain a valid address.',
//       field: 'from.email',
//       help: 'http://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/errors.html#message.from'
//     }
//   ]
//  }, {}]

// CASE: SUCCESS

//   response: Response {
//     statusCode: 202,
//     body: '',
//     headers: {
//       server: 'nginx',
//       date: 'Wed, 09 Dec 2020 19:08:40 GMT',
//       'content-length': '0',
//       connection: 'close',
//       'x-message-id': 'mEP4pfmxTSaIrIdEgxdAdw',
//       'access-control-allow-origin': 'https://sendgrid.api-docs.io',
//       'access-control-allow-methods': 'POST',
//       'access-control-allow-headers': 'Authorization, Content-Type, On-behalf-of, x-sg-elas-acl',
//       'access-control-max-age': '600',
//       'x-no-cors-reason': 'https://sendgrid.com/docs/Classroom/Basics/API/cors.html'
//     }
//   }
