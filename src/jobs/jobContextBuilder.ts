import Knex from "knex";
import knexConfig from "../db/knexfile";
import EmailApiDao from "./dao/EmailApiDao";
import ScheduledEmailDao from "../dao/ScheduledEmailDao";
import ScheduledEmailDaoImpl from "../dao/ScheduledEmailDaoImpl";

import EmailApiDaoImpl from "./dao/EmailApiDaoImpl";
import EmailService from "../service/EmailService";
import UserDaoKnex from "../dao/UserDaoKnex";
import MeetDaoKnex from "../dao/MeetDaoKnex";

export interface JobContext {
  knex: Knex;
  emailApiDao: EmailApiDao;
  scheduledEmailDao: ScheduledEmailDao;
  emailService: EmailService;
}

export default (): JobContext => {
  const knex = Knex(knexConfig);

  const scheduledEmailDao = new ScheduledEmailDaoImpl(knex);
  const emailApiDao = new EmailApiDaoImpl();
  const userDao = new UserDaoKnex(knex);
  const meetDao = new MeetDaoKnex(knex);

  const emailService = new EmailService(scheduledEmailDao, userDao, meetDao);

  return {
    knex,
    emailApiDao,
    scheduledEmailDao,
    emailService,
  };
};
