import BadgeDao from "../dao/BadgeDao";
import { Badge, BadgeShapes, Maybe, Scalars } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface BadgeServiceGetManyArgs {
  badgeId?: string;
}

export interface BadgeServiceGetOneArgs {
  badgeId: string;
}

export interface BadgeServiceAddOneInput {
  badgeId: string;
  alias: string;
  badgeShape: BadgeShapes;
  faIcon: string;
  backgroundHex?: string | null;
  iconHex?: string | null;
  title: string;
  description?: string | null;
  weight?: number | null;
}

export interface BadgeServiceEditOneInput {
  badgeId?: Maybe<Scalars["String"]>;
  alias?: Maybe<Scalars["String"]>;
  badgeShape?: Maybe<BadgeShapes>;
  faIcon?: Maybe<Scalars["String"]>;
  backgroundHex?: Maybe<Scalars["String"]>;
  iconHex?: Maybe<Scalars["String"]>;
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  weight?: Maybe<Scalars["Int"]>;
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
  async editOne(badgeId: string, input: BadgeServiceEditOneInput): Promise<Badge> {
    return this.badgeDao.editOne(badgeId, input);
  }
  async deleteOne(badgeId: string): Promise<boolean> {
    return this.badgeDao.deleteOne(badgeId);
  }
}
