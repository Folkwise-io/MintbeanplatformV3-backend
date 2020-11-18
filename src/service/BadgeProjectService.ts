import BadgeProjectDao from "../dao/BadgeProjectDao";
import BadgeProject from "../types/badgeProject";
import { MutationAwardBadgesArgs } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export default class BadgeProjectService implements EntityService<BadgeProject> {
  constructor(private badgeProjectDao: BadgeProjectDao) {}

  async getOne(args: any, context: any): Promise<BadgeProject> {
    throw new Error("not implemented");
  }

  async getMany(args: any): Promise<BadgeProject[]> {
    throw new Error("not implemented");
  }

  async addOne(input: any, context: any): Promise<BadgeProject> {
    throw new Error("not implemented");
  }

  async addMany(input: MutationAwardBadgesArgs): Promise<void> {
    return this.badgeProjectDao.addMany(input);
  }
}
