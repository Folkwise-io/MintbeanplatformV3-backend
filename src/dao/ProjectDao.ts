import {
  ProjectServiceAddOneInput,
  ProjectServiceGetManyArgs,
  ProjectServiceGetOneArgs,
} from "../service/ProjectService";
import { Project } from "../types/gqlGeneratedTypes";

export default interface ProjectDao {
  getOne(args: ProjectServiceGetOneArgs): Promise<Project | undefined>;
  getMany(args: ProjectServiceGetManyArgs): Promise<Project[]>;
  addOne(args: ProjectServiceAddOneInput): Promise<Project>;
  deleteOne(id: string): Promise<boolean>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(projects: Project[]): Promise<void>;
}
