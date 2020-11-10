import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import MediaAssetService, { MediaAssetServiceAddManyArgs } from "../../service/MediaAssetService";
import ProjectService from "../../service/ProjectService";
import { Project, Resolvers } from "../../types/gqlGeneratedTypes";
import ProjectResolverValidator from "../../validator/ProjectResolverValidator";
import ProjectMediaAssetService, { ProjectMediaAssetServiceAddOneArgs } from "../../service/ProjectMediaAssetService";

const projectResolver = (
  projectResolverValidator: ProjectResolverValidator,
  projectService: ProjectService,
  mediaAssetService: MediaAssetService,
  projectMediaAssetService: ProjectMediaAssetService,
): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" projects for admin? Currently this query does not get Projects with "deleted=true"
      project: (_root, args, context: ServerContext): Promise<Project | null> => {
        return projectResolverValidator
          .getOne(args, context)
          .then((args) => projectService.getOne(args))
          .then((result) => (result ? result : null));
      },
    },

    PublicUser: {
      projects: (user, context) => {
        return projectService.getMany({ userId: user.id });
      },
    },

    PrivateUser: {
      projects: (user, context) => {
        return projectService.getMany({ userId: user.id });
      },
    },

    Meet: {
      projects: (meet, context) => {
        return projectService.getMany({ meetId: meet.id });
      },
    },

    Mutation: {
      // TODO: why's there so much logic here??? Move to validator/services
      createProject: async (_root, args, context: ServerContext): Promise<Project> => {
        const inputUserId = args.input.userId;
        const currentUserId = context.getUserId();

        if (!currentUserId) {
          throw new AuthenticationError("You are not authorized to create a project! Please log in first.");
        } else if (!context.getIsAdmin() && inputUserId && inputUserId !== currentUserId) {
          throw new AuthenticationError("You are not authorized to create a project with the supplied userId!");
        }

        const argsWithResolvedUserId = { ...args, input: { ...args.input, userId: inputUserId || currentUserId } };

        // Add the new project to db first
        const newProject = await projectResolverValidator
          .addOne(argsWithResolvedUserId)
          .then((input) => projectService.addOne(input));

        // If no media assets were received, simply return the project as is
        const { cloudinaryPublicIds, userId } = argsWithResolvedUserId.input;
        if (!cloudinaryPublicIds || cloudinaryPublicIds.length === 0) {
          return newProject;
        }

        // If media assets are received, we must add the assets and join table data to the database, then query the
        // project again to retrieve these associated media assets to send back

        // TODO: Make this transactional somehow?

        // Media assets are received as an array of cloudinaryPublicIds for convenience, so we must transform the
        // array into an object that includes userId and meetId to hand off to MediaAssetService and
        // ProjectMediaAssetService
        const mediaAssets: MediaAssetServiceAddManyArgs = cloudinaryPublicIds.map((cloudinaryPublicId, index) => ({
          userId,
          cloudinaryPublicId,
          index,
        }));
        const { id: projectId } = newProject;

        // Add join table info to link newly created media asset to project
        const createdMediaAssets = await mediaAssetService.addMany(mediaAssets);
        const projectMediaAssets: ProjectMediaAssetServiceAddOneArgs[] = createdMediaAssets.map((mediaAsset) => ({
          projectId,
          mediaAssetId: mediaAsset.id,
        }));
        await projectMediaAssetService.addMany(projectMediaAssets);

        // Query the project again to retrieve its associated media assets
        return (projectService.getOne({ id: projectId }) as unknown) as Project;
      },

      deleteProject: (_root, args, context: ServerContext): Promise<boolean> => {
        return projectResolverValidator.deleteOne(args, context).then(({ id }) => projectService.deleteOne(id));
      },
    },
  };
};

export default projectResolver;
