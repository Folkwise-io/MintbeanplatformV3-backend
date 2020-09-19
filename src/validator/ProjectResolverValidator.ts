import { ServerContext } from "../buildServerContext";
import ProjectDao from "../dao/ProjectDao";
import { ProjectServiceAddOneInput, ProjectServiceGetOneArgs } from "../service/ProjectService";
import { MutationCreateProjectArgs, QueryProjectArgs } from "../types/gqlGeneratedTypes";

export default class ProjectResolverValidator {
  constructor(private projectDao: ProjectDao) {}
  async getOne(args: QueryProjectArgs, context: ServerContext): Promise<ProjectServiceGetOneArgs> {
    return args;
  }

  async addOne({ input }: MutationCreateProjectArgs): Promise<ProjectServiceAddOneInput> {
    //TODO: Validate createProject input: check if userId exists in db? (only needed if admin requests)
    return input;
  }
}
