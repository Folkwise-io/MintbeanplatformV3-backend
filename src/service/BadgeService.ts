import BadgeDao from "../dao/BadgeDao";
import { Badge, BadgeShape, Maybe, QueryBadgeArgs, Scalars } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface BadgeServiceGetManyArgs {
  badgeId?: string;
  projectId?: string;
}

export interface BadgeServiceAddOneInput {
  alias: string;
  badgeShape: BadgeShape;
  faIcon: string;
  backgroundHex?: string | null;
  iconHex?: string | null;
  title: string;
  description?: string | null;
  weight?: number | null;
}

export interface BadgeServiceEditOneInput {
  id?: string | null;
  alias?: string | null;
  badgeShape?: BadgeShape | null;
  faIcon?: string | null;
  backgroundHex?: string | null;
  iconHex?: string | null;
  title?: string | null;
  description?: string | null;
  weight?: number | null;
}

export default class BadgeService implements EntityService<Badge> {
  constructor(private badgeDao: BadgeDao) {}
  async getMany(args: BadgeServiceGetManyArgs): Promise<Badge[]> {
    return this.badgeDao.getMany(args);
  }
  async getOne(input: QueryBadgeArgs): Promise<Badge> {
    return this.badgeDao.getOne(input);
  }
  async addOne(input: BadgeServiceAddOneInput): Promise<Badge> {
    return this.badgeDao.addOne(input);
  }
  async editOne(id: string, input: BadgeServiceEditOneInput): Promise<Badge> {
    return this.badgeDao.editOne(id, input);
  }
  async deleteOne(id: string): Promise<boolean> {
    return this.badgeDao.deleteOne(id);
  }
}
