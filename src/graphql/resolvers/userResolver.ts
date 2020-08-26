import { knex } from "../../db/knex";
import { Resolvers } from "../generated/tsTypes";

const userResolver: Resolvers = {
  Query: {
    users: (_parent, args) => {
      return knex("users").where({ ...args });
    },

    user: (_parent, args) => {
      return knex("users")
        .where({ ...args })
        .first();
    },
  },
};

export default userResolver;
