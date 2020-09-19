import { ServerContext } from "../buildServerContext";
import ProjectDao from "../dao/ProjectDao";
import { ProjectServiceGetOneArgs } from "../service/ProjectService";
import { QueryProjectArgs } from "../types/gqlGeneratedTypes";

export default class ProjectResolverValidator {
  constructor(private projectDao: ProjectDao) {}
  async getOne(args: QueryProjectArgs, context: ServerContext): Promise<ProjectServiceGetOneArgs> {
    return args;
  }
}
