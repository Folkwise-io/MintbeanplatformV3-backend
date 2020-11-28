import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import { Project, Resolvers } from "../../types/gqlGeneratedTypes";
import ProjectResolverValidator from "../../validator/ProjectResolverValidator";
import MediaAssetDao, { MediaAssetDaoAddManyArgs } from "../../dao/MediaAssetDao";
import ProjectMediaAssetDao, { ProjectMediaAssetDaoAddOneArgs } from "../../dao/ProjectMediaAssetDao";
import ProjectDao from "../../dao/ProjectDao";
import BadgeProjectService from "../../service/BadgeProjectService";

const projectResolver = (
  projectResolverValidator: ProjectResolverValidator,
  projectDao: ProjectDao,
  mediaAssetDao: MediaAssetDao,
  projectMediaAssetDao: ProjectMediaAssetDao,
  badgeProjectService: BadgeProjectService,
): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" projects for admin? Currently this query does not get Projects with "deleted=true"
      project: (_root, args, context: ServerContext): Promise<Project | null> => {
        return projectResolverValidator
          .getOne(args, context)
          .then((args) => projectDao.getOne(args))
          .then((result) => (result ? result : null));
      },
    },

    PublicUser: {
      projects: (user, context) => {
        return projectDao.getMany({ userId: user.id });
      },
    },

    PrivateUser: {
      projects: (user, context) => {
        return projectDao.getMany({ userId: user.id });
      },
    },

    Meet: {
      projects: (meet, context) => {
        return projectDao.getMany({ meetId: meet.id });
      },
    },

    Badge: {
      projects: (badge, context) => {
        return projectDao.getMany({ badgeId: badge.id });
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
          .then((input) => projectDao.addOne(input));

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
        const mediaAssets: MediaAssetDaoAddManyArgs = cloudinaryPublicIds.map((cloudinaryPublicId, index) => ({
          userId,
          cloudinaryPublicId,
          index,
        }));
        const { id: projectId } = newProject;

        // Add join table info to link newly created media asset to project
        const createdMediaAssets = await mediaAssetDao.addMany(mediaAssets);
        const projectMediaAssets: ProjectMediaAssetDaoAddOneArgs[] = createdMediaAssets.map((mediaAsset) => ({
          projectId,
          mediaAssetId: mediaAsset.id,
        }));
        await projectMediaAssetDao.addMany(projectMediaAssets);

        // Query the project again to retrieve its associated media assets
        return (projectDao.getOne({ id: projectId }) as unknown) as Project;
      },

      deleteProject: (_root, args, context: ServerContext): Promise<boolean> => {
        return projectResolverValidator.deleteOne(args, context).then(({ id }) => projectDao.deleteOne(id));
      },

      awardBadgesToProject: (_root, args, context: ServerContext): Promise<Project | null> => {
        return projectResolverValidator.awardBadgesToProject(args, context).then(async ({ projectId, badgeIds }) => {
          await badgeProjectService.addOne({ projectId, badgeIds }, context);
          const project = await projectDao.getOne({ id: projectId });
          return project || null;
        });
      },
    },
  };
};

export default projectResolver;
