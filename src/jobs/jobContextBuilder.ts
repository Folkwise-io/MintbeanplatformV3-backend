import Knex from "knex";
import knexConfig from "../db/knexfile";
import EmailApiDao from "../dao/EmailApiDao";
import EmailScheduleDao from "../dao/EmailScheduleDao";
import EmailScheduleDaoImpl from "../dao/EmailScheduleDaoImpl";
import EmailApiDaoImpl from "../dao/EmailApiDaoImpl";

export interface JobContext {
  knex: Knex;
  emailApiDao: EmailApiDao;
  emailScheduleDao: EmailScheduleDao;
}

export default (): JobContext => {
  const knex = Knex(knexConfig);

  const emailApiDao = new EmailApiDaoImpl(); // should sendgrid api key be used in EmailApiDao constructor?
  const emailScheduleDao = new EmailScheduleDaoImpl(knex);

  return {
    knex,
    emailApiDao,
    emailScheduleDao,
  };
};
