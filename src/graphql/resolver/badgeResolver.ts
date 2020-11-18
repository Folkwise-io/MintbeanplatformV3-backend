import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import BadgeService from "../../service/BadgeService";
import { Badge, Resolvers } from "../../types/gqlGeneratedTypes";
import BadgeResolverValidator from "../../validator/BadgeResolverValidator";

const badgeResolver = (badgeResolverValidator: BadgeResolverValidator, badgeService: BadgeService): Resolvers => {
  return {
    Query: {
      badges: (_root, args, context: ServerContext): Promise<Badge[]> => {
        return badgeResolverValidator.getMany(args, context).then((args) => badgeService.getMany(args));
      },
      badge: (_root, args, context: ServerContext): Promise<Badge> => {
        return badgeResolverValidator.getOne(args, context).then((args) => badgeService.getOne(args));
      },
    },
    Project: {
      badges: (project): Promise<Badge[]> => {
        return badgeService.getMany({ projectId: project.id });
      },
    },
    Mutation: {
      createBadge: (_root, args, context: ServerContext): Promise<Badge> => {
        // if (!context.getIsAdmin()) {
        //   throw new AuthenticationError("You are not authorized to create a badge!");
        // }
        return badgeResolverValidator.addOne(args, context).then((input) => badgeService.addOne(input));
      },
      editBadge: (_root, args, context: ServerContext): Promise<Badge> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to edit a badge!");
        }
        return badgeResolverValidator.editOne(args, context).then(({ id, input }) => badgeService.editOne(id, input));
      },
      deleteBadge: (_root, args, context: ServerContext): Promise<boolean> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to edit a badge!");
        }
        return badgeResolverValidator.deleteOne(args).then((id) => badgeService.deleteOne(id));
      },
    },
  };
};

export default badgeResolver;
