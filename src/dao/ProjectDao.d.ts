import {
  ProjectServiceAddOneInput,
  ProjectServiceGetManyArgs,
  ProjectServiceGetOneArgs,
} from "../service/ProjectService";

export default interface ProjectDao {
  getOne(args: any): Promise<Project>;
  getMany(args: ProjectServiceGetManyArgs): Promise<Project[]>;
  addOne(args: ProjectServiceAddOneInput): Promise<Project>;
  editOne(id: string, input: ProjectServiceEditOneInput): Promise<Project>;
  deleteOne(id: string): Promise<boolean>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(projects: Project[]): Promise<void>;
}
