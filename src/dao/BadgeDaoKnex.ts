import Knex from "knex";
import { BadgeServiceAddOneInput, BadgeServiceEditOneInput, BadgeServiceGetManyArgs } from "../service/BadgeService";
import { Badge, QueryBadgeArgs } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import BadgeDao from "./BadgeDao";

export default class BadgeDaoKnex implements BadgeDao {
  constructor(private knex: Knex) {}
  async getMany(args: BadgeServiceGetManyArgs): Promise<Badge[]> {
    return handleDatabaseError(async () => {
      const badges: Badge[] = await this.knex("badges")
        .select(["badges.*"])
        .leftJoin("badgesProjects", "badges.id", "=", "badgesProjects.badgeId")
        .where({ ...args })
        .orderBy("badges.createdAt", "desc");
      return badges;
    });
  }
  async getOne(args: QueryBadgeArgs): Promise<Badge> {
    const { id } = args;
    return handleDatabaseError(async () => {
      const badge: Badge = await this.knex("badges").select(["*"]).where({ "badges.id": id }).first();
      return badge;
    });
  }
  async addOne(args: BadgeServiceAddOneInput): Promise<Badge> {
    return handleDatabaseError(async () => {
      const newBadges = (await this.knex("badges").insert(args).returning("*")) as Badge[];
      return newBadges[0];
    });
  }
  async editOne(id: string, input: BadgeServiceEditOneInput): Promise<Badge> {
    return handleDatabaseError(async () => {
      const editedBadges = (await this.knex("badges")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as Badge[];
      return editedBadges[0];
    });
  }
  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex<Badge>("badges").where({ id }).delete();
      return true;
    });
  }

  // Testing methods below, for TestManager to call
  async addMany(badges: Badge[]): Promise<void> {
    return this.knex<Badge>("badges").insert(badges);
  }

  deleteAll(): Promise<void> {
    return this.knex<Badge>("badges").delete();
  }
}
