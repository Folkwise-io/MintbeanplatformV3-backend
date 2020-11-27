import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import ProjectDao, { ProjectDaoAddOneInput, ProjectDaoGetOneArgs } from "../dao/ProjectDao";
import {
  MutationAwardBadgesArgs,
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
  async getOne(args: QueryProjectArgs, context: ServerContext): Promise<ProjectDaoGetOneArgs> {
    return args;
  }

  async addOne({ input }: MutationCreateProjectArgs): Promise<ProjectDaoAddOneInput> {
    // TODO: Validate createProject input: check if userId exists in db? (only needed if admin requests)
    validateAgainstSchema<ProjectDaoAddOneInput>(createProjectInputSchema, input);

    // Remove mediaAssets field as it is not part of projects table
    const inputWithoutMediaAssets: ProjectDaoAddOneInput = (({ userId, meetId, title, sourceCodeUrl, liveUrl }) => ({
      userId,
      meetId,
      title,
      sourceCodeUrl,
      liveUrl,
    }))(input);
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

  async awardBadges(
    { projectId, badgeIds }: MutationAwardBadgesArgs,
    context: ServerContext,
  ): Promise<MutationAwardBadgesArgs> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to award badges!");
    }
    // TODO: ensure badges exist, same problem as above
    return this.projectDao
      .getOne({ id: projectId })
      .then((project) => ensureExists("Project")(project))
      .then(() => ({ projectId, badgeIds }));
  }
}
