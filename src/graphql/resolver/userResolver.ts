import { knex } from "../../db/knex";
import { Resolvers } from "../generated/tsTypes";
import UserResolverService from "../../service/UserResolverService";

const userResolver = (userResolverService: UserResolverService): Resolvers => {
  return {
    Query: {
      users: (_root, args, context) => {
        return userResolverService.getMany(args);
      },

      user: (_root, args) => {
        return userResolverService.getOne(args);
      },
    },
  };
};

export default userResolver;
