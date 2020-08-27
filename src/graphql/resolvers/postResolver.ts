import { knex } from "../../db/knex";
import { Resolvers } from "../generated/tsTypes";

const postResolver: Resolvers = {
  Query: {
    posts: (_root, args) => {
      return knex("posts").where({ ...args });
    },

    post: (_root, args) => {
      return knex("posts")
        .where({ ...args })
        .first();
    },
  },

  Post: {
    user: (post) => {
      return knex("users").where({ id: post.userId }).first();
    },
  },
};

export default postResolver;
