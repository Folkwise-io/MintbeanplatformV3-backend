import { ServerContext } from "../buildServerContext";
import BadgeProjectDao from "../dao/BadgeProjectDao";
import ProjectDao from "../dao/ProjectDao";
import BadgeProject from "../types/badgeProject";
import { MutationAwardBadgesToProjectArgs, Project } from "../types/gqlGeneratedTypes";

export default class BadgeProjectService {
  constructor(private badgeProjectDao: BadgeProjectDao, private projectDao: ProjectDao) {}

  async getOne(args: any, context: any): Promise<BadgeProject> {
    throw new Error("not implemented");
  }

  async getMany(args: any): Promise<BadgeProject[]> {
    throw new Error("not implemented");
  }

  async addMany(input: any, context: any): Promise<BadgeProject[]> {
    throw new Error("not implemented");
  }

  async syncBadges(input: MutationAwardBadgesToProjectArgs, _context: ServerContext): Promise<Project | undefined> {
    await this.badgeProjectDao.syncBadges(input);
    return this.projectDao.getOne({ id: input.projectId });
  }
}
