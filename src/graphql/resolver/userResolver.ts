import { Resolvers, User } from "../../types/gqlGeneratedTypes";
import UserService from "../../service/UserService";
import UserResolverValidator from "../../validator/UserResolverValidator";
import { ServerContext } from "../../buildContext";
import { AuthenticationError } from "apollo-server-express";

const userResolver = (userResolverValidator: UserResolverValidator, userService: UserService): Resolvers => {
  return {
    Query: {
      user: (_root, args, context: ServerContext): Promise<User> => {
        return userResolverValidator.getOne(args, context).then((args) => userService.getOne(args, context));
      },

      users: (_root, args, context: ServerContext): Promise<User[]> => {
        // TODO: Add validation once we need to validate params that are used for pagination / sorting etc.
        return userService.getMany(args, context);
      },

      me: (_root, _args, context: ServerContext): Promise<User> => {
        const userId = context.getUserId();
        if (!userId) {
          throw new AuthenticationError("You are not logged in!");
        }

        return userService.getOne({ id: userId }, context);
      },
    },

    Mutation: {
      login: (_root, args, context: ServerContext): Promise<User> => {
        return userResolverValidator.login(args, context).then((args) => userService.login(args, context));
      },

      logout: (_root, _args, context: ServerContext): boolean => {
        const userId = context.getUserId();
        if (userId) {
          context.clearCookie();
          return true;
        }
        return false;
      },
    },
  };
};

export default userResolver;
