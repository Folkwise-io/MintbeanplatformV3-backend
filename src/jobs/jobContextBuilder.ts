import Knex from "knex";
import knexConfig from "../db/knexfile";
import EmailApiDao from "../dao/EmailApiDao";
import ScheduledEmailDao from "../dao/EmailScheduleDao";
import ScheduledEmailDaoImpl from "../dao/EmailScheduleDaoImpl";
import EmailApiDaoImpl from "../dao/EmailApiDaoImpl";

export interface JobContext {
  knex: Knex;
  emailApiDao: EmailApiDao;
  emailScheduleDao: ScheduledEmailDao;
}

export default (): JobContext => {
  const knex = Knex(knexConfig);

  const emailApiDao = new EmailApiDaoImpl(); // should sendgrid api key be used in EmailApiDao constructor?
  const emailScheduleDao = new ScheduledEmailDaoImpl(knex);

  return {
    knex,
    emailApiDao,
    emailScheduleDao,
  };
};
