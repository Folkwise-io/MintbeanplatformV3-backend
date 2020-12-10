import Knex from "knex";
import EmailScheduleDao, { EmailScheduleDaoSendInput } from "./EmailScheduleDao";
import handleDatabaseError from "../util/handleDatabaseError";

export default class EmailScheduleDaoImpl implements EmailScheduleDao {
  constructor(private knex: Knex) {}

  async queue(input: EmailScheduleDaoSendInput): Promise<void> {
    handleDatabaseError(async () => {
      await this.knex("scheduledEmails").insert(input);
    });
  }
}
