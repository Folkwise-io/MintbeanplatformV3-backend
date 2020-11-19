import { Project } from "../types/gqlGeneratedTypes";

export interface ProjectDaoGetOneArgs {
  id: string;
}

export interface ProjectDaoGetManyArgs {
  userId?: string;
  meetId?: string;
}

export interface ProjectDaoAddOneInput {
  userId?: string;
  meetId?: string;
  title: string;
  sourceCodeUrl: string;
  liveUrl: string;
}

export default interface ProjectDao {
  getOne(args: ProjectDaoGetOneArgs): Promise<Project | undefined>;
  getMany(args: ProjectDaoGetManyArgs): Promise<Project[]>;
  addOne(args: ProjectDaoAddOneInput): Promise<Project>;
  deleteOne(id: string): Promise<boolean>;
}
