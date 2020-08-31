import { knex } from "../../db/knex";
import { Resolvers } from "../generated/tsTypes";

const userResolver: Resolvers = {
  Query: {
    users: (_root, args) => {
      return knex("users").where({ ...args });
    },

    user: (_root, args) => {
      return knex("users")
        .where({ ...args })
        .first();
    },
  },

  User: {
    posts: (user) => {
      return knex("posts").where({ userId: user.id });
    },
  },
};

export default userResolver;
