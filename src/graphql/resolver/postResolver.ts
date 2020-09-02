import { knex } from "../../db/knex";
import { Resolvers } from "../generated/tsTypes";

const postResolver: Resolvers = {
  Query: {
    post: (_root, args) => {
      return knex("posts")
        .where({ ...args })
        .first();
    },

    posts: (_root, args) => {
      return knex("posts").where({ ...args });
    },
  },

  User: {
    posts: (user) => {
      return knex("posts").where({ userId: user.id });
    },
  },

  Post: {
    user: (post) => {
      return knex("users").where({ id: post.userId }).first();
    },
  },
};

export default postResolver;
