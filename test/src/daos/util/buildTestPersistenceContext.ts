import Knex from "knex";
import KanbanCanonCardDao from "../../../../src/dao/KanbanCanonCardDao";
import KanbanDao from "../../../../src/dao/KanbanDao";
import KanbanDaoKnex from "../../../../src/dao/KanbanDaoKnex";
import MediaAssetDao from "../../../../src/dao/MediaAssetDao";
import MediaAssetDaoKnex from "../../../../src/dao/MediaAssetDaoKnex";
import MeetDao from "../../../../src/dao/MeetDao";
import MeetDaoKnex from "../../../../src/dao/MeetDaoKnex";
import MeetRegistrationDao from "../../../../src/dao/MeetRegistrationDao";
import MeetRegistrationDaoKnex from "../../../../src/dao/MeetRegistrationDaoKnex";
import ProjectDao from "../../../../src/dao/ProjectDao";
import ProjectDaoKnex from "../../../../src/dao/ProjectDaoKnex";
import ProjectMediaAssetDao from "../../../../src/dao/ProjectMediaAssetDao";
import ProjectMediaAssetDaoKnex from "../../../../src/dao/ProjectMediaAssetKnex";
import UserDao from "../../../../src/dao/UserDao";
import UserDaoKnex from "../../../../src/dao/UserDaoKnex";
import TestKanbanCanonDao from "../TestKanbanCanonDao";
import TestKanbanCanonDaoKnex from "../TestKanbanCanonDaoKnex";
import knexConfig from "../../../../src/db/knexfile";
import KanbanCanonCardDaoKnex from "../../../../src/dao/KanbanCanonCardDaoKnex";

export interface TestPersistenceContext {
  userDao: UserDao;
  meetDao: MeetDao;
  projectDao: ProjectDao;
  mediaAssetDao: MediaAssetDao;
  projectMediaAssetDao: ProjectMediaAssetDao;
  meetRegistrationDao: MeetRegistrationDao;
  kanbanCanonDao: TestKanbanCanonDao;
  kanbanCanonCardDao: KanbanCanonCardDao;
  kanbanDao: KanbanDao;
}

export function buildTestPersistenceContext(): TestPersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDaoKnex(knex);
  const meetDao = new MeetDaoKnex(knex);
  const projectDao = new ProjectDaoKnex(knex);
  const mediaAssetDao = new MediaAssetDaoKnex(knex);
  const projectMediaAssetDao = new ProjectMediaAssetDaoKnex(knex);
  const meetRegistrationDao = new MeetRegistrationDaoKnex(knex);
  const kanbanCanonDao = new TestKanbanCanonDaoKnex(knex);
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
