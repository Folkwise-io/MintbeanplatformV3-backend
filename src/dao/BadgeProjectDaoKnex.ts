import Knex from "knex";
import { knex } from "../db/knex";
import BadgeProject from "../types/badgeProject";
import { MutationAwardBadgesToProjectArgs } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import BadgeProjectDao from "./BadgeProjectDao";

export default class BadgeProjectDaoKnex implements BadgeProjectDao {
  constructor(private knex: Knex) {}
  async addOne(badgesProject: MutationAwardBadgesToProjectArgs): Promise<BadgeProject> {
    const { projectId, badgeIds } = badgesProject;
    const bpToInsert = badgeIds.map((badgeId) => ({ projectId, badgeId }));
    return handleDatabaseError(async () => {
      await this.knex("badgesProjects").del();
      await this.knex("badgesProjects")
        .insert(bpToInsert)
        .onConflict(["projectId", "badgeId"])
        .merge()
        .groupBy("projectId");
    });
  }
}
