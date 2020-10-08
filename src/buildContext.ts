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
import KanbanDaoKnex from "./dao/KanbanDaoKnex";
import KanbanDao from "./dao/KanbanDao";
import KanbanService from "./service/KanbanService";
import KanbanResolverValidator from "./validator/KanbanResolverValidator";
import KanbanCardDaoKnex from "./dao/KanbanCardDaoKnex";
import KanbanCardDao from "./dao/KanbanCardDao";
import KanbanCardService from "./service/KanbanCardService";
import KanbanCardResolverValidator from "./validator/KanbanCardResolverValidator";

export interface PersistenceContext {
  userDao: UserDao;
  meetDao: MeetDao;
  projectDao: ProjectDao;
  mediaAssetDao: MediaAssetDao;
  projectMediaAssetDao: ProjectMediaAssetDao;
  meetRegistrationDao: MeetRegistrationDao;
  kanbanDao: KanbanDao;
  kanbanCardDao: KanbanCardDao;
}

export function buildPersistenceContext(): PersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDaoKnex(knex);
  const meetDao = new MeetDaoKnex(knex);
  const projectDao = new ProjectDaoKnex(knex);
  const mediaAssetDao = new MediaAssetDaoKnex(knex);
  const projectMediaAssetDao = new ProjectMediaAssetDaoKnex(knex);
  const meetRegistrationDao = new MeetRegistrationDaoKnex(knex);
  const kanbanDao = new KanbanDaoKnex(knex);
  const kanbanCardDao = new KanbanCardDaoKnex(knex);

  return {
    userDao,
    meetDao,
    projectDao,
    mediaAssetDao,
    projectMediaAssetDao,
    meetRegistrationDao,
    kanbanDao,
    kanbanCardDao,
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
  kanbanResolverValidator: KanbanResolverValidator;
  kanbanService: KanbanService;
  kanbanCardResolverValidator: KanbanCardResolverValidator;
  kanbanCardService: KanbanCardService;
}

export function buildResolverContext(persistenceContext: PersistenceContext): ResolverContext {
  const {
    userDao,
    meetDao,
    projectDao,
    mediaAssetDao,
    projectMediaAssetDao,
    meetRegistrationDao,
    kanbanDao,
    kanbanCardDao,
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
  const kanbanResolverValidator = new KanbanResolverValidator(kanbanDao);
  const kanbanService = new KanbanService(kanbanDao);
  const kanbanCardResolverValidator = new KanbanCardResolverValidator(kanbanCardDao);
  const kanbanCardService = new KanbanCardService(kanbanCardDao);

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
    kanbanService,
    kanbanResolverValidator,
    kanbanCardService,
    kanbanCardResolverValidator,
  };
}
