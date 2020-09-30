// Not working on Posts until parity - keeping file here for reference & sample query for frontend
import { knex } from "../../db/knex";
import { Resolvers } from "../../types/gqlGeneratedTypes";

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

  PublicUser: {
    posts: (user) => {
      return knex("posts").where({ userId: user.id });
    },
  },

  PrivateUser: {
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
