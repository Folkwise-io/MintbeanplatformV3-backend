import { knex } from "../../db/knex";
import { Resolvers } from "../generated/tsTypes";
import UserResolverService from "../../service/UserResolverService";

const userResolver = (userResolverService: UserResolverService): Resolvers => {
  return {
    Query: {
      users: (_root, args) => {
        return userResolverService.getMany(args);
      },

      user: (_root, args) => {
        return userResolverService.getOne(args);
      },
    },

    User: {
      posts: (user) => {
        return knex("posts").where({ userId: user.id });
      },
    },
  };
};

export default userResolver;
