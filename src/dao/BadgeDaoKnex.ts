import Knex from "knex";
import {
  BadgeServiceAddOneInput,
  BadgeServiceEditOneInput,
  BadgeServiceGetManyArgs,
  BadgeServiceGetOneArgs,
} from "../service/BadgeService";
import { Badge } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import BadgeDao from "./BadgeDao";

export default class BadgeDaoKnex implements BadgeDao {
  constructor(private knex: Knex) {}
  async getMany(args: BadgeServiceGetManyArgs): Promise<Badge[]> {
    return handleDatabaseError(async () => {
      const badges: Badge[] = await this.knex("badges")
        .where({ ...args, deleted: false })
        .orderBy("createdAt", "desc");
      return badges;
    });
  }
  async getOne(args: BadgeServiceGetOneArgs): Promise<Badge> {
    return handleDatabaseError(async () => {
      const badge: Badge = await this.knex("badges")
        .where({ ...args, deleted: false })
        .first();
      return badge;
    });
  }
  async addOne(args: BadgeServiceAddOneInput): Promise<Badge> {
    return handleDatabaseError(async () => {
      const newBadge = (await this.knex("badges").insert(args).returning("*")) as Badge[];
      return newBadge[0];
    });
  }
  async editOne(badgeId: string, input: BadgeServiceEditOneInput): Promise<Badge> {
    return handleDatabaseError(async () => {
      const editedBadge = (await this.knex("badges")
        .where({ badgeId })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as Badge[];
      return editedBadge[0];
    });
  }
  async deleteOne(badgeId: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("badges").where({ badgeId }).update({ deleted: true });
      return true;
    });
  }
}
