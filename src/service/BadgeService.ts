import BadgeDao from "../dao/BadgeDao";
import { Badge, BadgeShapes } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface BadgeServiceGetManyArgs {
  id?: string;
}

export interface BadgeServiceGetOneArgs {
  id: string;
}

export interface BadgeServiceAddOneInput {
  id: string;
  alias: string;
  badgeShape: BadgeShapes;
  backgroundHex?: string | null;
  iconHex?: string | null;
  title: string;
  description?: string | null;
  weight?: number | null;
}

export default class BadgeService implements EntityService<Badge> {
  constructor(private badgeDao: BadgeDao) {}
  async getMany(args: BadgeServiceGetManyArgs): Promise<Badge[]> {
    return this.badgeDao.getMany(args);
  }
  async getOne(args: BadgeServiceGetOneArgs): Promise<Badge> {
    return this.badgeDao.getOne(args);
  }
  async addOne(input: BadgeServiceAddOneInput): Promise<Badge> {
    return this.badgeDao.addOne(input);
  }
}
