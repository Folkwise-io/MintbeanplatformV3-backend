import { AuthenticationError, UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import ProjectDao from "../dao/ProjectDao";
import { ProjectServiceAddOneInput, ProjectServiceGetOneArgs } from "../service/ProjectService";
import {
  MutationCreateProjectArgs,
  MutationDeleteProjectArgs,
  Project,
  QueryProjectArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import createProjectInputSchema from "./yupSchemas/createProjectInputSchema";

export default class ProjectResolverValidator {
  constructor(private projectDao: ProjectDao) {}
  async getOne(args: QueryProjectArgs, context: ServerContext): Promise<ProjectServiceGetOneArgs> {
    return args;
  }

  async addOne({ input }: MutationCreateProjectArgs): Promise<ProjectServiceAddOneInput> {
    //TODO: Validate createProject input: check if userId exists in db? (only needed if admin requests)
    validateAgainstSchema<ProjectServiceAddOneInput>(createProjectInputSchema, input);

    // Remove mediaAssets field as it is not part of projects table
    const inputWithoutMediaAssets: ProjectServiceAddOneInput = (({
      userId,
      meetId,
      title,
      sourceCodeUrl,
      liveUrl,
    }) => ({ userId, meetId, title, sourceCodeUrl, liveUrl }))(input);
    return inputWithoutMediaAssets;
  }

  async deleteOne({ id }: MutationDeleteProjectArgs, context: ServerContext): Promise<MutationDeleteProjectArgs> {
    // Check if project id exists in db
    const project = await this.projectDao.getOne({ id }).then((project) => ensureExists<Project>("Project")(project));

    const { userId: projectOwnerId } = project;
    const currentUserId = context.getUserId();

    if (!context.getIsAdmin() && currentUserId !== projectOwnerId) {
      throw new AuthenticationError("You are not authorized to delete this project!");
    }
    return { id };
  }
}
