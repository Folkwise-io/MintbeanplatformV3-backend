import { Resolvers } from "../generated/tsTypes";
import UserService from "../../service/UserService";
import UserResolverValidator from "../../validator/UserResolverValidator";

const userResolver = (userResolverValidator: UserResolverValidator, userService: UserService): Resolvers => {
  return {
    Query: {
      user: (_root, args, context) => {
        return userResolverValidator.getOne(args, context).then((args) => userService.getOne(args));
      },
      
      users: (_root, args, context) => {
        return userService.getMany(args);
      },
    },
  };
};

export default userResolver;
