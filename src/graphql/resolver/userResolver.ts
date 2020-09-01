import { Resolvers } from "../generated/tsTypes";
import UserResolverService from "../../service/UserResolverService";
import UserValidator from "../../validator/UserValidator";

const userResolver = (userResolverService: UserResolverService, userValidator: UserValidator): Resolvers => {
  return {
    Query: {
      users: (_root, args, context) => {
        return userResolverService.getMany(args);
      },

      user: (_root, args, context) => {
        return userValidator.validateOne(args, context).then((args) => userResolverService.getOne(args));
      },
    },
  };
};

export default userResolver;
