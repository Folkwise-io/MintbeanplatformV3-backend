import Knex from "knex";
import knexConfig from "../db/knexfile";
import EmailApiDao from "../dao/EmailApiDao"; // TODO: move emailApiDao to job world
import ScheduledEmailDao from "../dao/ScheduledEmailDao";
import ScheduledEmailDaoImpl from "../dao/ScheduledEmailDaoImpl";

import EmailApiDaoImpl from "../dao/EmailApiDaoImpl";
import { EmailService } from "../service/EmailService";
import { EmailDao } from "../dao/EmailDao";
import config from "../util/config";
import UserDaoKnex from "../dao/UserDaoKnex";
import MeetDaoKnex from "../dao/MeetDaoKnex";

export interface JobContext {
  knex: Knex;
  emailApiDao: EmailApiDao;
  scheduledEmailDao: ScheduledEmailDao;
  emailService: EmailService;
}

const { sendgridKey } = config;

export default (): JobContext => {
  const knex = Knex(knexConfig);

  const scheduledEmailDao = new ScheduledEmailDaoImpl(knex);
  const emailApiDao = new EmailApiDaoImpl(); // should sendgrid api key be used in EmailApiDao constructor?
  // TODO remove this old emailDao, required for email service for now
  const _emailDao = new EmailDao(sendgridKey);
  const userDao = new UserDaoKnex(knex);
  const meetDao = new MeetDaoKnex(knex);

  const emailService = new EmailService(_emailDao /* <- TODO: remove */, scheduledEmailDao, userDao, meetDao);

  return {
    knex,
    emailApiDao,
    scheduledEmailDao,
    emailService,
  };
};
