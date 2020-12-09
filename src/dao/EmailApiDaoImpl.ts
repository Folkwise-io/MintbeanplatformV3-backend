import { Email } from "../types/Email";
import EmailApiDao from "./EmailApiDao";
import sgMail from "@sendgrid/mail";
import config from "../util/config";

const { sendgridKey } = config;
sgMail.setApiKey(sendgridKey);

export default class EmailApiDaoImpl implements EmailApiDao {
  async send(email: Email): Promise<void> {
    try {
      sgMail.send(email).then((res) => console.log(res));
    } catch (e) {
      console.log(e);
    }
  }
}
