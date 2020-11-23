import Knex from "knex";
import BadgeProject from "../types/badgeProject";
import { MutationAwardBadgesArgs } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import BadgeProjectDao from "./BadgeProjectDao";

export default class BadgeProjectDaoKnex implements BadgeProjectDao {
  constructor(private knex: Knex) {}

  async deleteAll(): Promise<void> {
    throw new Error("not implemented");
  }

  async addMany(): Promise<BadgeProject[]> {
    throw new Error("not implemented");
  }

  async addOne(badgesProject: MutationAwardBadgesArgs): Promise<BadgeProject> {
    const { projectId, badgeIds } = badgesProject;
    const bpToInsert = badgeIds.map((badgeId) => ({ projectId, badgeId }));
    return handleDatabaseError(async () => {
      await this.knex("badgesProjects").where({ projectId }).del();
      await this.knex("badgesProjects").insert(bpToInsert);
    });
  }
}
