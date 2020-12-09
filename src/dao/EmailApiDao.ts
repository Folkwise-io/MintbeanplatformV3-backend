import { Email } from "../types/Email";

export default interface EmailApiDao {
  send(email: Email): Promise<void>;
}
