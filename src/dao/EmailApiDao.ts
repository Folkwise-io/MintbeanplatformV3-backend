import { Email, EmailResponse } from "../types/ScheduledEmail";

// TODO: move this Dao to jobs world
export default interface EmailApiDao {
  send(email: Email): Promise<EmailResponse>;
}
