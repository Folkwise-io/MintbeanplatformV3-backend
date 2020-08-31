import { knex } from "../../db/knex";
import { Resolvers } from "../generated/tsTypes";
import UserResolverService from "../../service/UserResolverService";
import UserDao from "../../dao/UserDao";

// Q: How do we ensure a single instance of knex among all resolvers?
const userResolverService = new UserResolverService(UserDao);

const userResolver: Resolvers = {
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

export default userResolver;
