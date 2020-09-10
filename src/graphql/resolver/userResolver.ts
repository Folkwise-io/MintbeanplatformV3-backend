import { Resolvers } from "../../types/gqlGeneratedTypes";
import UserService from "../../service/UserService";
import UserResolverValidator from "../../validator/UserResolverValidator";
import { ServerContext } from "../../buildContext";

const userResolver = (userResolverValidator: UserResolverValidator, userService: UserService): Resolvers => {
  return {
    Query: {
      user: (_root, args, context: ServerContext) => {
        return userResolverValidator.getOne(args, context).then((args) => userService.getOne(args));
      },

      users: (_root, args, context: ServerContext) => {
        // TODO: Add validation once we need to validate params that are used for pagination / sorting etc.
        return userService.getMany(args);
      },
    },

    Mutation: {
      login: (_root, args, context: ServerContext) => {
        return userResolverValidator.login(args, context).then((args) => userService.login(args));
      },
    },
  };
};

export default userResolver;
