import { Email, EmailResponse, EmailResponseStatus } from "../types/Email";
import EmailApiDao from "./EmailApiDao";
import sgMail from "@sendgrid/mail";

const { SUCCESS, REQUEST_ERROR, SERVER_ERROR } = EmailResponseStatus;

export default class EmailApiDaoImpl implements EmailApiDao {
  async sendEmail(email: Email): Promise<EmailResponse> {
    try {
      const [res] = await sgMail.send(email);
      return { statusCode: res.statusCode, status: SUCCESS };
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));

      return {
        statusCode: e.code || 400,
        // Sendgrid e codes: https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/errors.html
        status: e?.code < 500 ? REQUEST_ERROR : SERVER_ERROR,
        errorMessage: e?.response?.body?.errors[0]?.message || "Unknown error",
      };
    }
  }
}
