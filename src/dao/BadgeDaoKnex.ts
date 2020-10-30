import Knex from "knex";
import { BadgeServiceAddOneInput, BadgeServiceGetManyArgs, BadgeServiceGetOneArgs } from "../service/BadgeService";
import { Badge } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import BadgeDao from "./BadgeDao";

export default class BadgeDaoKnex implements BadgeDao {
  constructor(private knex: Knex) {}
  async getMany(args: BadgeServiceGetManyArgs): Promise<Badge[]> {
    return handleDatabaseError(async () => {
      const badges: Badge[] = await this.knex("badges")
        .where({ ...args })
        .orderBy("createdAt", "desc");
      return badges;
    });
  }
  async getOne(args: BadgeServiceGetOneArgs): Promise<Badge> {
    return handleDatabaseError(async () => {
      const badge: Badge = await this.knex("badges")
        .where({ ...args })
        .first();
      return badge;
    });
  }
  async addOne(args: BadgeServiceAddOneInput): Promise<Badge> {
    return handleDatabaseError(async () => {
      const newBadges = (await this.knex("badges").insert(args).returning("*")) as Badge[];
      return newBadges[0];
    });
  }
}
