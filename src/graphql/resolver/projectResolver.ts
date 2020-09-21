import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import MediaAssetService, { MediaAssetServiceAddManyArgs } from "../../service/MediaAssetService";
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
      createProject: async (_root, args, context: ServerContext): Promise<Project> => {
        const inputUserId = args.input.userId;
        const currentUserId = context.getUserId();

        if (!currentUserId) {
          throw new AuthenticationError("You are not authorized to create a project! Please log in first.");
        } else if (!context.getIsAdmin() && inputUserId && inputUserId !== currentUserId) {
          throw new AuthenticationError("You are not authorized to create a project with the supplied userId!");
        }

        const argsWithResolvedUserId = { ...args, input: { ...args.input, userId: inputUserId || currentUserId } };

        // TODO: Make this transactional somehow?

        // Media assets are received as an array of cloudinaryPublicIds for convenience, so we must transform the
        // array into an object that includes userId and meetId to hand off to MediaAssetService and
        // ProjectMediaAssetService
        const { cloudinaryPublicIds, userId } = argsWithResolvedUserId.input;
        if (cloudinaryPublicIds && cloudinaryPublicIds.length > 0) {
          const mediaAssets: MediaAssetServiceAddManyArgs = cloudinaryPublicIds.map((cloudinaryPublicId, index) => ({
            userId,
            cloudinaryPublicId,
            index,
          }));
          const createdMediaAssets = await mediaAssetService.addMany(mediaAssets);
          console.log(createdMediaAssets);
        }

        return projectResolverValidator.addOne(argsWithResolvedUserId).then((input) => projectService.addOne(input));
      },
    },
  };
};

export default projectResolver;
