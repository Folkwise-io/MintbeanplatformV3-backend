import Knex from "knex";
import { MutationAwardBadgesArgs } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import BadgeProjectDao from "./BadgeProjectDao";

export default class BadgeProjectDaoKnex implements BadgeProjectDao {
  constructor(private knex: Knex) {}

  async deleteAll(): Promise<void> {
    throw new Error("not implemented");
  }

  async addMany(badgesProject: MutationAwardBadgesArgs): Promise<void> {
    const { projectId, badgeIds } = badgesProject;
    const bpToInsert = badgeIds.map((badgeId) => ({ projectId, badgeId }));
    return handleDatabaseError(() => this.knex("badgesProjects").insert(bpToInsert));
  }
}
