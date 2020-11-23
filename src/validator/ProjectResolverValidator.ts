import { UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import ProjectDao from "../dao/ProjectDao";
import { ProjectServiceAddOneInput, ProjectServiceGetOneArgs } from "../service/ProjectService";
import {
  MutationAwardBadgesArgs,
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
    return this.projectDao
      .getOne({ id })
      .then((project) => ensureExists("Project")(project))
      .then(({ id }) => id);
  }

  async awardBadges(
    { projectId, badgeIds }: MutationAwardBadgesArgs,
    _context: ServerContext,
  ): Promise<MutationAwardBadgesArgs> {
    // TODO: ensure badges exist, same problem as above
    return this.projectDao
      .getOne({ id: projectId })
      .then((project) => ensureExists("Project")(project))
      .then(() => ({ projectId, badgeIds }));
  }
}
