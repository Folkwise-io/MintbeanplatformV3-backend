import Knex from "knex";
import knexConfig from "./db/knexfile";
import UserService from "./service/UserService";
import UserDaoKnex from "./dao/UserDaoKnex";
import UserResolverValidator from "./validator/UserResolverValidator";
import UserDao from "./dao/UserDao";
import MeetDaoKnex from "./dao/MeetDaoKnex";
import MeetDao from "./dao/MeetDao";
import MeetService from "./service/MeetService";
import MeetResolverValidator from "./validator/MeetResolverValidator";
import ProjectDao from "./dao/ProjectDao";
import ProjectDaoKnex from "./dao/ProjectDaoKnex";
import ProjectService from "./service/ProjectService";
import ProjectResolverValidator from "./validator/ProjectResolverValidator";
import MediaAssetDao from "./dao/MediaAssetDao";
import MediaAssetDaoKnex from "./dao/MediaAssetDaoKnex";
import MediaAssetService from "./service/MediaAssetService";
import MediaAssetResolverValidator from "./validator/MediaAssetResolverValidator";
import ProjectMediaAssetDaoKnex from "./dao/ProjectMediaAssetKnex";
import ProjectMediaAssetDao from "./dao/ProjectMediaAssetDao";
import ProjectMediaAssetService from "./service/ProjectMediaAssetService";
import MeetRegistrationDaoKnex from "./dao/MeetRegistrationDaoKnex";
import MeetRegistrationDao from "./dao/MeetRegistrationDao";
import MeetRegistrationService from "./service/MeetRegistrationService";
import EmailService from "./service/EmailService";
import EmailDao from "./dao/EmailDao";
import EmailResolverValidator from "./validator/EmailResolverValidator";
import EmailCommanderImpl from "./service/EmailService/EmailCommander";
import { EmailCommander } from "./types/Email";
import EmailDaoSendgridKnex from "./dao/EmailDaoSendgridKnex";

export interface PersistenceContext {
  userDao: UserDao;
  meetDao: MeetDao;
  projectDao: ProjectDao;
  mediaAssetDao: MediaAssetDao;
  projectMediaAssetDao: ProjectMediaAssetDao;
  meetRegistrationDao: MeetRegistrationDao;
  emailDao: EmailDao;
}

export function buildPersistenceContext(): PersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDaoKnex(knex);
  const meetDao = new MeetDaoKnex(knex);
  const projectDao = new ProjectDaoKnex(knex);
  const mediaAssetDao = new MediaAssetDaoKnex(knex);
  const projectMediaAssetDao = new ProjectMediaAssetDaoKnex(knex);
  const meetRegistrationDao = new MeetRegistrationDaoKnex(knex);
  const emailDao = new EmailDaoSendgridKnex(knex);

  return {
    userDao,
    meetDao,
    projectDao,
    mediaAssetDao,
    projectMediaAssetDao,
    meetRegistrationDao,
    emailDao,
  };
}

export interface ResolverContext {
  userResolverValidator: UserResolverValidator;
  userService: UserService;
  meetResolverValidator: MeetResolverValidator;
  meetService: MeetService;
  projectResolverValidator: ProjectResolverValidator;
  projectService: ProjectService;
  mediaAssetResolverValidator: MediaAssetResolverValidator;
  mediaAssetService: MediaAssetService;
  projectMediaAssetService: ProjectMediaAssetService;
  meetRegistrationService: MeetRegistrationService;
  emailResolverValidator: EmailResolverValidator;
  emailService: EmailService;
  emailCommander: EmailCommander;
}

export function buildResolverContext(persistenceContext: PersistenceContext): ResolverContext {
  const {
    userDao,
    meetDao,
    projectDao,
    mediaAssetDao,
    projectMediaAssetDao,
    meetRegistrationDao,
    emailDao,
  } = persistenceContext;
  const userResolverValidator = new UserResolverValidator(userDao);
  const userService = new UserService(userDao);
  const meetResolverValidator = new MeetResolverValidator(meetDao);
  const meetService = new MeetService(meetDao);
  const projectResolverValidator = new ProjectResolverValidator(projectDao);
  const projectService = new ProjectService(projectDao);
  const mediaAssetResolverValidator = new MediaAssetResolverValidator(mediaAssetDao);
  const mediaAssetService = new MediaAssetService(mediaAssetDao);
  const projectMediaAssetService = new ProjectMediaAssetService(projectMediaAssetDao);
  const meetRegistrationService = new MeetRegistrationService(meetRegistrationDao);
  const emailService = new EmailService(emailDao);
  const emailCommander = new EmailCommanderImpl(emailDao);
  const emailResolverValidator = new EmailResolverValidator();

  return {
    userResolverValidator,
    userService,
    meetResolverValidator,
    meetService,
    projectResolverValidator,
    projectService,
    mediaAssetResolverValidator,
    mediaAssetService,
    projectMediaAssetService,
    meetRegistrationService,
    emailResolverValidator,
    emailService,
    emailCommander,
  };
}
