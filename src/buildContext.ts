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
import ProjectResolverValidator from "./validator/ProjectResolverValidator";
import MediaAssetDao from "./dao/MediaAssetDao";
import MediaAssetDaoKnex from "./dao/MediaAssetDaoKnex";
import ProjectMediaAssetDaoKnex from "./dao/ProjectMediaAssetKnex";
import ProjectMediaAssetDao from "./dao/ProjectMediaAssetDao";
import MeetRegistrationDaoKnex from "./dao/MeetRegistrationDaoKnex";
import MeetRegistrationDao from "./dao/MeetRegistrationDao";
import { EmailService } from "./service/EmailService";
import { EmailDao } from "./dao/EmailDao";
import config from "./util/config";
import EmailResolverValidator from "./validator/EmailResolverValidator";
import BadgeResolverValidator from "./validator/BadgeResolverValidator";
import BadgeService from "./service/BadgeService";
import BadgeDao from "./dao/BadgeDao";
import BadgeDaoKnex from "./dao/BadgeDaoKnex";
import BadgeProjectDao from "./dao/BadgeProjectDao";
import BadgeProjectDaoKnex from "./dao/BadgeProjectDaoKnex";
import BadgeProjectService from "./service/BadgeProjectService";
import KanbanCanonDao from "./dao/KanbanCanonDao";
import KanbanCanonDaoKnex from "./dao/KanbanCanonDaoKnex";
import KanbanCanonService from "./service/KanbanCanonService";
import KanbanCanonCardDao from "./dao/KanbanCanonCardDao";
import KanbanCanonCardDaoKnex from "./dao/KanbanCanonCardDaoKnex";
import KanbanCanonCardService from "./service/KanbanCanonCardService";
import KanbanCanonCardResolverValidator from "./validator/KanbanCanonCardResolverValidator";
import KanbanDao from "./dao/KanbanDao";
import KanbanDaoKnex from "./dao/KanbanDaoKnex";
import KanbanService from "./service/KanbanService";
import KanbanResolverValidator from "./validator/KanbanResolverValidator";
import KanbanCanonResolverValidator from "./validator/KanbanCanonResolverValidator";
import EmailScheduleDao from "./dao/EmailScheduleDao";
import EmailScheduleDaoImpl from "./dao/EmailScheduleDaoImpl";

export interface PersistenceContext {
  userDao: UserDao;
  meetDao: MeetDao;
  projectDao: ProjectDao;
  mediaAssetDao: MediaAssetDao;
  projectMediaAssetDao: ProjectMediaAssetDao;
  meetRegistrationDao: MeetRegistrationDao;
  badgeDao: BadgeDao;
  badgeProjectDao: BadgeProjectDao;
  kanbanCanonDao: KanbanCanonDao;
  kanbanCanonCardDao: KanbanCanonCardDao;
  kanbanDao: KanbanDao;
  emailScheduleDao: EmailScheduleDao;
}

export function buildPersistenceContext(): PersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDaoKnex(knex);
  const meetDao = new MeetDaoKnex(knex);
  const projectDao = new ProjectDaoKnex(knex);
  const mediaAssetDao = new MediaAssetDaoKnex(knex);
  const projectMediaAssetDao = new ProjectMediaAssetDaoKnex(knex);
  const meetRegistrationDao = new MeetRegistrationDaoKnex(knex);
  const badgeDao = new BadgeDaoKnex(knex);
  const badgeProjectDao = new BadgeProjectDaoKnex(knex);
  const kanbanCanonDao = new KanbanCanonDaoKnex(knex);
  const kanbanCanonCardDao = new KanbanCanonCardDaoKnex(knex);
  const kanbanDao = new KanbanDaoKnex(knex);
  const emailScheduleDao = new EmailScheduleDaoImpl(knex);

  return {
    userDao,
    meetDao,
    projectDao,
    mediaAssetDao,
    projectMediaAssetDao,
    meetRegistrationDao,
    badgeDao,
    badgeProjectDao,
    kanbanCanonDao,
    kanbanCanonCardDao,
    kanbanDao,
    emailScheduleDao,
  };
}

export interface ResolverContext {
  userResolverValidator: UserResolverValidator;
  userService: UserService;
  meetResolverValidator: MeetResolverValidator;
  meetService: MeetService;
  projectResolverValidator: ProjectResolverValidator;
  emailResolverValidator: EmailResolverValidator;
  emailService: EmailService;
  badgeResolverValidator: BadgeResolverValidator;
  badgeService: BadgeService;
  badgeProjectDao: BadgeProjectDao;
  badgeProjectService: BadgeProjectService;
  kanbanCanonService: KanbanCanonService;
  kanbanCanonResolverValidator: KanbanCanonResolverValidator;
  kanbanCanonCardService: KanbanCanonCardService;
  kanbanCanonCardResolverValidator: KanbanCanonCardResolverValidator;
  kanbanService: KanbanService;
  kanbanResolverValidator: KanbanResolverValidator;
  kanbanCanonCardDao: KanbanCanonCardDao;
  kanbanCanonDao: KanbanCanonDao;
  kanbanDao: KanbanDao;
  mediaAssetDao: MediaAssetDao;
  meetRegistrationDao: MeetRegistrationDao;
  meetDao: MeetDao;
  projectMediaAssetDao: ProjectMediaAssetDao;
  projectDao: ProjectDao;
  userDao: UserDao;
  emailScheduleDao: EmailScheduleDao;
}

export function buildResolverContext(persistenceContext: PersistenceContext): ResolverContext {
  const {
    userDao,
    meetDao,
    projectDao,
    mediaAssetDao,
    projectMediaAssetDao,
    meetRegistrationDao,
    badgeDao,
    badgeProjectDao,
    kanbanCanonDao,
    kanbanCanonCardDao,
    kanbanDao,
    emailScheduleDao,
  } = persistenceContext;
  const userResolverValidator = new UserResolverValidator(userDao);
  const userService = new UserService(userDao);
  const meetResolverValidator = new MeetResolverValidator(meetDao);
  const meetService = new MeetService(meetDao);
  const projectResolverValidator = new ProjectResolverValidator(projectDao);
  const kanbanCanonService = new KanbanCanonService(kanbanCanonDao);
  const kanbanCanonResolverValidator = new KanbanCanonResolverValidator(kanbanCanonDao, kanbanCanonCardDao);
  const kanbanCanonCardService = new KanbanCanonCardService(kanbanCanonCardDao, kanbanCanonDao);
  const kanbanCanonCardResolverValidator = new KanbanCanonCardResolverValidator(kanbanCanonCardDao, kanbanCanonDao);
  const kanbanService = new KanbanService(kanbanDao);
  const kanbanResolverValidator = new KanbanResolverValidator(
    kanbanDao,
    kanbanCanonDao,
    kanbanCanonCardDao,
    userDao,
    meetDao,
  );

  const { sendGridKey } = config;
  const emailResolverValidator = new EmailResolverValidator();
  const emailDao = new EmailDao(sendGridKey);
  const emailService = new EmailService(emailDao);
  const badgeResolverValidator = new BadgeResolverValidator(badgeDao);
  const badgeService = new BadgeService(badgeDao);
  const badgeProjectService = new BadgeProjectService(badgeProjectDao, projectDao);

  return {
    userResolverValidator,
    userService,
    meetResolverValidator,
    meetService,
    projectResolverValidator,
    emailResolverValidator,
    emailService,
    badgeResolverValidator,
    badgeService,
    badgeProjectDao,
    badgeProjectService,
    kanbanCanonService,
    kanbanCanonCardService,
    kanbanCanonCardResolverValidator,
    kanbanService,
    kanbanCanonResolverValidator,
    kanbanResolverValidator,
    kanbanCanonCardDao,
    kanbanCanonDao,
    kanbanDao,
    mediaAssetDao,
    meetRegistrationDao,
    meetDao,
    projectMediaAssetDao,
    projectDao,
    userDao,
    emailScheduleDao,
  };
}
