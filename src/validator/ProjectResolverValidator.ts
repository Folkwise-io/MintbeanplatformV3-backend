import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import ProjectDao, { ProjectDaoAddOneInput, ProjectDaoGetOneArgs } from "../dao/ProjectDao";
import {
  MutationAwardBadgesToProjectArgs,
  MutationCreateProjectArgs,
  MutationDeleteProjectArgs,
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
    const project = await this.projectDao.getOne({ id });
    ensureExists("Project")(project);

    const requesterId = context.getUserId();
    const isAdmin = context.getIsAdmin();
    if (project && requesterId !== project.userId && !isAdmin) {
      throw new AuthenticationError("You are not autorized to delete this project!");
    }
    return { id };
  }

  async awardBadgesToProject(
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
