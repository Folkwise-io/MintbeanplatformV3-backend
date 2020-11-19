import Knex from "knex";
import KanbanDao from "../../../../src/dao/KanbanDao";
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
import TestKanbanCanonDaoKnex from "../TestKanbanCanonDaoKnex";
import knexConfig from "../../../../src/db/knexfile";
import { PersistenceContext } from "../../../../src/buildContext";
import TestKanbanCanonCardDaoKnex from "../TestKanbanCanonCardDaoKnex";
import TestKanbanDaoKnex from "../TestKanbanDaoKnex";

// for use in test daos to ensure strict typing of additional methods
export interface TestPersistenceContext extends PersistenceContext {
  userDao: UserDao;
  meetDao: MeetDao;
  projectDao: ProjectDao;
  mediaAssetDao: MediaAssetDao;
  projectMediaAssetDao: ProjectMediaAssetDao;
  meetRegistrationDao: MeetRegistrationDao;
  kanbanCanonDao: TestKanbanCanonDaoKnex;
  kanbanCanonCardDao: TestKanbanCanonCardDaoKnex;
  kanbanDao: TestKanbanDaoKnex;
}

// TODO: Help Monarch! The polymophism thing didn't work (setting return type to PersistenceContext caused errors in TestManager)
// Instead as a temporary fix I extended the PersistenceContext above to assure all daos accounted for
export function buildTestPersistenceContext(): TestPersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDaoKnex(knex);
  const meetDao = new MeetDaoKnex(knex);
  const projectDao = new ProjectDaoKnex(knex);
  const mediaAssetDao = new MediaAssetDaoKnex(knex);
  const projectMediaAssetDao = new ProjectMediaAssetDaoKnex(knex);
  const meetRegistrationDao = new MeetRegistrationDaoKnex(knex);
  const kanbanCanonDao = new TestKanbanCanonDaoKnex(knex);
  const kanbanCanonCardDao = new TestKanbanCanonCardDaoKnex(knex);
  const kanbanDao = new TestKanbanDaoKnex(knex);

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
