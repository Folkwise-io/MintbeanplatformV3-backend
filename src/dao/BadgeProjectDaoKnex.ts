import Knex from "knex";
import BadgeProject from "../types/badgeProject";
import { Badge, MutationAwardBadgesToProjectArgs } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import BadgeProjectDao, { BadgeProjectDaoGetManyArgs } from "./BadgeProjectDao";

export default class BadgeProjectDaoKnex implements BadgeProjectDao {
  constructor(private knex: Knex) {}
  getMany({ projectId }: BadgeProjectDaoGetManyArgs): Promise<Badge[]> {
    return handleDatabaseError(async () => {
      const badges = await this.knex("badgesProjects")
        .select("badges.*")
        .leftJoin("badges", "badges.id", "=", "badgesProjects.badgeId")
        .where({ projectId });
      return badges;
    });
  }

  // "select "badges".* from "badgesProjects" left join "badges" on "badges"."id" = "badgesProjects"."badgeId" where "projectId" = '00000000-"
  async syncBadges({ projectId, badgeIds }: MutationAwardBadgesToProjectArgs): Promise<void> {
    const bpToInsert = badgeIds.map((badgeId) => ({ projectId, badgeId }));
    return handleDatabaseError(async () => {
      await this.knex("badgesProjects").where({ projectId }).del();
      await this.knex("badgesProjects").insert(bpToInsert);
    });
  }
}
