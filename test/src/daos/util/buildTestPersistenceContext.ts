import Knex from "knex";
import { PersistenceContext } from "../../../../src/buildContext";
import TestKanbanCanonDaoKnex from "../TestKanbanCanonDaoKnex";
import knexConfig from "../../../../src/db/knexfile";
import TestKanbanCanonCardDaoKnex from "../TestKanbanCanonCardDaoKnex";
import TestKanbanDaoKnex from "../TestKanbanDaoKnex";
import TestMeetRegistrationDaoKnex from "../TestMeetRegistrationDaoKnex";
import ProjectMediaAssetDaoKnex from "../../../../src/dao/ProjectMediaAssetKnex";
import TestMediaAssetDaoKnex from "../TestMediaAssetDaoKnex";
import TestProjectDaoKnex from "../TestProjectDaoKnex";
import TestMeetDaoKnex from "../TestMeetDaoKnex";
import TestUserDaoKnex from "../TestUserDaoKnex";
import TestBadgeDaoKnex from "../TestBadgeDaoKnex";
import BadgeProjectDaoKnex from "../../../../src/dao/BadgeProjectDaoKnex";
import EmailScheduleDaoImpl from "../../../../src/dao/EmailScheduleDaoImpl";
import EmailScheduleDao from "../../../../src/dao/EmailScheduleDao";

// for use in test daos to ensure strict typing of additional methods
export interface TestPersistenceContext extends PersistenceContext {
  userDao: TestUserDaoKnex;
  meetDao: TestMeetDaoKnex;
  projectDao: TestProjectDaoKnex;
  mediaAssetDao: TestMediaAssetDaoKnex;
  projectMediaAssetDao: ProjectMediaAssetDaoKnex; // Uses actual dao since no extension necessary at this time
  meetRegistrationDao: TestMeetRegistrationDaoKnex;
  kanbanCanonDao: TestKanbanCanonDaoKnex;
  kanbanCanonCardDao: TestKanbanCanonCardDaoKnex;
  kanbanDao: TestKanbanDaoKnex;
  badgeDao: TestBadgeDaoKnex;
  badgeProjectDao: BadgeProjectDaoKnex;
  emailScheduleDao: EmailScheduleDao;
}

// TODO: Help Monarch! The polymophism thing didn't work (setting return type to PersistenceContext caused errors in TestManager)
// Instead as a temporary fix I extended the PersistenceContext above to assure all daos accounted for
export function buildTestPersistenceContext(): TestPersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new TestUserDaoKnex(knex);
  const meetDao = new TestMeetDaoKnex(knex);
  const projectDao = new TestProjectDaoKnex(knex);
  const mediaAssetDao = new TestMediaAssetDaoKnex(knex);
  const projectMediaAssetDao = new ProjectMediaAssetDaoKnex(knex);
  const meetRegistrationDao = new TestMeetRegistrationDaoKnex(knex);
  const kanbanCanonDao = new TestKanbanCanonDaoKnex(knex);
  const kanbanCanonCardDao = new TestKanbanCanonCardDaoKnex(knex);
  const kanbanDao = new TestKanbanDaoKnex(knex);
  const badgeDao = new TestBadgeDaoKnex(knex);
  const badgeProjectDao = new BadgeProjectDaoKnex(knex);
  const emailScheduleDao = new EmailScheduleDaoImpl(knex);

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
    badgeDao,
    badgeProjectDao,
    emailScheduleDao,
  };
}
