import ProjectDao from "../dao/ProjectDao";
import { Project } from "../types/gqlGeneratedTypes";
import { Args, EntityService } from "./EntityService";

export interface ProjectServiceGetOneArgs {
  id: string;
}

export interface ProjectServiceGetManyArgs {
  userId?: string;
  meetId?: string;
  badgeId?: string;
}

export interface ProjectServiceAddOneInput {
  userId?: string;
  meetId?: string;
  title: string;
  sourceCodeUrl: string;
  liveUrl: string;
}

export default class ProjectService implements EntityService<Project> {
  constructor(private projectDao: ProjectDao) {}

  getOne(args: ProjectServiceGetOneArgs, context: any): Promise<Project> {
    return this.projectDao.getOne(args);
  }

  getMany(args: ProjectServiceGetManyArgs, context: any): Promise<Project[]> {
    return this.projectDao.getMany(args);
  }

  addOne(input: ProjectServiceAddOneInput): Promise<Project> {
    return this.projectDao.addOne(input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.projectDao.deleteOne(id);
  }
}
