import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import MediaAssetService from "../../service/MediaAssetService";
import ProjectService from "../../service/ProjectService";
import { Project, Resolvers } from "../../types/gqlGeneratedTypes";
import ProjectResolverValidator from "../../validator/ProjectResolverValidator";
import ProjectMediaAssetService from "../../service/ProjectMediaAssetService";

const projectResolver = (
  projectResolverValidator: ProjectResolverValidator,
  projectService: ProjectService,
  mediaAssetService: MediaAssetService,
  projectMediaAssetService: ProjectMediaAssetService,
): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" projects for admin? Currently this query does not get Projects with "deleted=true"
      project: (_root, args, context: ServerContext): Promise<Project> => {
        return projectResolverValidator.getOne(args, context).then((args) => projectService.getOne(args, context));
      },
    },

    User: {
      projects: (user, context) => {
        return projectService.getMany({ userId: user.id }, context);
      },
    },

    Meet: {
      projects: (meet, context) => {
        return projectService.getMany({ meetId: meet.id }, context);
      },
    },

    Mutation: {
      createProject: (_root, args, context: ServerContext): Promise<Project> => {
        const inputUserId = args.input.userId;
        const currentUserId = context.getUserId();

        if (!currentUserId) {
          throw new AuthenticationError("You are not authorized to create a project! Please log in first.");
        } else if (!context.getIsAdmin() && inputUserId && inputUserId !== currentUserId) {
          throw new AuthenticationError("You are not authorized to create a project with the supplied userId!");
        }

        const argsWithResolvedUserId = { ...args, input: { ...args.input, userId: inputUserId || currentUserId } };
        return projectResolverValidator.addOne(argsWithResolvedUserId).then((input) => projectService.addOne(input));
      },
    },
  };
};

export default projectResolver;
