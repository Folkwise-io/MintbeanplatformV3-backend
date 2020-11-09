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
    Mutation: {
      createBadge: (_root, args, context: ServerContext): Promise<Badge> => {
        // if (!context.getIsAdmin()) {
        //   throw new AuthenticationError("You are not authorized to create a badge!");
        // }
        //handle error for if badge's alias already exists
        return badgeResolverValidator.addOne(args, context).then((input) => badgeService.addOne(input));
      },
      editBadge: (_root, args, context: ServerContext): Promise<Badge> => {
        // if (!context.getIsAdmin()) {
        //   throw new AuthenticationError("You are not authorized to edit a badge!");
        // }
        return badgeResolverValidator
          .editOne(args, context)
          .then(({ badgeId, input }) => badgeService.editOne(badgeId, input));
      },
      deleteBadge: (_root, args, context: ServerContext): Promise<boolean> => {
        // if (!context.getIsAdmin()) {
        //   throw new AuthenticationError("You are not authorized to edit a badge!");
        // }
        return badgeResolverValidator.deleteOne(args).then((badgeId) => badgeService.deleteOne(badgeId));
      },
    },
  };
};

export default badgeResolver;
