import { AuthenticationError, UserInputError } from "apollo-server-express";
import { string } from "yup";
import { ServerContext } from "../buildServerContext";
import ProjectDao from "../dao/ProjectDao";
import { ProjectServiceAddOneInput, ProjectServiceGetOneArgs } from "../service/ProjectService";
import {
  MutationAwardBadgesToProjectArgs,
  MutationCreateProjectArgs,
  MutationDeleteProjectArgs,
  QueryProjectArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
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

  async deleteOne({ id }: MutationDeleteProjectArgs): Promise<string> {
    // Check if project id exists in db
    const project = await this.projectDao.getOne({ id });
    ensureExists("Project")(project);
    return id;
  }

  async awardBadges(
    { projectId, badgeIds }: MutationAwardBadgesToProjectArgs,
    _context: ServerContext,
  ): Promise<MutationAwardBadgesToProjectArgs> {
    if (!_context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to award badges!");
    }
    const project = await this.projectDao.getOne({ id: projectId });
    ensureExists("Project")(project);
    return { projectId, badgeIds };
  }
}
