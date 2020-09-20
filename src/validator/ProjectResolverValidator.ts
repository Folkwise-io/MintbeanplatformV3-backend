import { UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import ProjectDao from "../dao/ProjectDao";
import { ProjectServiceAddOneInput, ProjectServiceGetOneArgs } from "../service/ProjectService";
import { MutationCreateProjectArgs, QueryProjectArgs } from "../types/gqlGeneratedTypes";
import createProjectInputSchema from "./yupSchemas/createProjectInputSchema";

export default class ProjectResolverValidator {
  constructor(private projectDao: ProjectDao) {}
  async getOne(args: QueryProjectArgs, context: ServerContext): Promise<ProjectServiceGetOneArgs> {
    return args;
  }

  async addOne({ input }: MutationCreateProjectArgs): Promise<ProjectServiceAddOneInput> {
    //TODO: Validate createProject input: check if userId exists in db? (only needed if admin requests)
    // Q: Got TS error when trying to promise-chain
    try {
      createProjectInputSchema.validateSync(input);
    } catch (e) {
      throw new UserInputError(e.message);
    }
    return input;
  }
}
