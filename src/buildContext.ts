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
import { EmailService } from "./service/EmailService";
import { EmailDao } from "./dao/EmailDao";
import config from "./util/config";
import EmailResolverValidator from "./validator/EmailResolverValidator";
import KanbanCanonDao from "./dao/KanbanCanonDao";
import KanbanCanonDaoKnex from "./dao/KanbanCanonDaoKnex";
import KanbanCanonService from "./service/KanbanCanonService";
import KanbanCanonCardDao from "./dao/KanbanCanonCardDao";
import KanbanCanonCardDaoKnex from "./dao/KanbanCanonCardDaoKnex";
import KanbanCanonCardService from "./service/KanbanCanonCardService";
import KanbanCanonCardResolverValidator from "./validator/kanbanCanonCardResolverValidator";
import KanbanDao from "./dao/KanbanDao";
import KanbanDaoKnex from "./dao/KanbanDaoKnex";
import KanbanService from "./service/KanbanService";
import KanbanResolverValidator from "./validator/kanbanResolverValidator";

export interface PersistenceContext {
  userDao: UserDao;
  meetDao: MeetDao;
  projectDao: ProjectDao;
  mediaAssetDao: MediaAssetDao;
  projectMediaAssetDao: ProjectMediaAssetDao;
  meetRegistrationDao: MeetRegistrationDao;
  kanbanCanonDao: KanbanCanonDao;
  kanbanCanonCardDao: KanbanCanonCardDao;
  kanbanDao: KanbanDao;
}

export function buildPersistenceContext(): PersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDaoKnex(knex);
  const meetDao = new MeetDaoKnex(knex);
  const projectDao = new ProjectDaoKnex(knex);
  const mediaAssetDao = new MediaAssetDaoKnex(knex);
  const projectMediaAssetDao = new ProjectMediaAssetDaoKnex(knex);
  const meetRegistrationDao = new MeetRegistrationDaoKnex(knex);
  const kanbanCanonDao = new KanbanCanonDaoKnex(knex);
  const kanbanCanonCardDao = new KanbanCanonCardDaoKnex(knex);
  const kanbanDao = new KanbanDaoKnex(knex);

  return {
    userDao,
    meetDao,
    projectDao,
    mediaAssetDao,
    projectMediaAssetDao,
    meetRegistrationDao,
    kanbanCanonDao,
    kanbanCanonCardDao,
    kanbanDao,
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
  kanbanCanonService: KanbanCanonService;
  kanbanCanonCardService: KanbanCanonCardService;
  kanbanCanonCardResolverValidator: KanbanCanonCardResolverValidator;
  kanbanService: KanbanService;
  kanbanResolverValidator: KanbanResolverValidator;
}

export function buildResolverContext(persistenceContext: PersistenceContext): ResolverContext {
  const {
    userDao,
    meetDao,
    projectDao,
    mediaAssetDao,
    projectMediaAssetDao,
    meetRegistrationDao,
    kanbanCanonDao,
    kanbanCanonCardDao,
    kanbanDao,
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
  const kanbanCanonService = new KanbanCanonService(kanbanCanonDao);
  const kanbanCanonCardService = new KanbanCanonCardService(kanbanCanonCardDao);
  const kanbanCanonCardResolverValidator = new KanbanCanonCardResolverValidator(kanbanCanonCardDao, kanbanCanonDao);
  const kanbanService = new KanbanService(kanbanDao);
  const kanbanResolverValidator = new KanbanResolverValidator(kanbanDao);

  const { sendGridKey } = config;
  const emailResolverValidator = new EmailResolverValidator();
  const emailDao = new EmailDao(sendGridKey);
  const emailService = new EmailService(emailDao);

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
    kanbanCanonService,
    kanbanCanonCardService,
    kanbanCanonCardResolverValidator,
    kanbanService,
    kanbanResolverValidator,
  };
}
