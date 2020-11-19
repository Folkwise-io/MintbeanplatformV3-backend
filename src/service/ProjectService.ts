import ProjectDao, { ProjectDaoAddOneInput, ProjectDaoGetManyArgs, ProjectDaoGetOneArgs } from "../dao/ProjectDao";
import { Project } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export default class ProjectService implements EntityService<Project | undefined> {
  constructor(private projectDao: ProjectDao) {}

  getOne(args: ProjectDaoGetOneArgs): Promise<Project | undefined> {
    return this.projectDao.getOne(args);
  }

  getMany(args: ProjectDaoGetManyArgs): Promise<Project[]> {
    return this.projectDao.getMany(args);
  }

  addOne(input: ProjectDaoAddOneInput): Promise<Project> {
    return this.projectDao.addOne(input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.projectDao.deleteOne(id);
  }
}
