import Knex from "knex";
import BadgeProject from "../types/badgeProject";
import { MutationAwardBadgesToProjectArgs } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import BadgeProjectDao from "./BadgeProjectDao";

export default class BadgeProjectDaoKnex implements BadgeProjectDao {
  constructor(private knex: Knex) {}
  async syncBadges(badgesProject: MutationAwardBadgesToProjectArgs): Promise<void> {
    const { projectId, badgeIds } = badgesProject;
    const bpToInsert = badgeIds.map((badgeId) => ({ projectId, badgeId }));
    return handleDatabaseError(async () => {
      await this.knex("badgesProjects").where({ projectId }).del();
      await this.knex("badgesProjects").insert(bpToInsert);
    });
  }
}
