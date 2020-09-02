import { Resolvers } from "../generated/tsTypes";
import UserService from "../../service/UserResolverService";
import UserResolverValidator from "../../validator/UserValidator";

const userResolver = (userResolverValidator: UserResolverValidator, userService: UserService): Resolvers => {
  return {
    Query: {
      users: (_root, args, context) => {
        return userService.getMany(args);
      },

      user: (_root, args, context) => {
        return userResolverValidator.getOne(args, context).then((args) => userService.getOne(args));
      },
    },
  };
};

export default userResolver;
