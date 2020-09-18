import ProjectDao from "../dao/ProjectDao";
import { Project } from "../types/gqlGeneratedTypes";
import { Args, EntityService } from "./EntityService";

export interface ProjectServiceGetOneArgs {
  id: string;
}

export default class ProjectService implements EntityService<Project> {
  constructor(private projectDao: ProjectDao) {}

  getOne(args: ProjectServiceGetOneArgs, context: any): Promise<Project> {
    return this.projectDao.getOne(args);
  }

  getMany(args: Args, context: any): Promise<Project[]> {
    throw "Not implemented";
  }

  addOne(args: any, context: any): Promise<Project> {
    throw "Not implemented";
  }
}
