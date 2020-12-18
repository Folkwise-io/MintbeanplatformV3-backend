import { Email, EmailResponse } from "../types/ScheduledEmail";

// TODO: move this Dao to jobs world
export default interface EmailApiDao {
  /**
   *
   * @param email - The email instructions for sendgrid
   */
  send(email: Email): Promise<EmailResponse>;
}
