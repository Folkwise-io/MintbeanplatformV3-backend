import { Email, EmailResponse } from "../types/Email";

export default interface EmailApiDao {
  send(email: Email): Promise<EmailResponse>;
}
