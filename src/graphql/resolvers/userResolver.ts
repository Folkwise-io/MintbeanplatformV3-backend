import { knex } from "../../db/knex";

export default {
  Query: {
    users: (_parent: any, args: any) => {
      return knex("users").where({ ...args });
    },

    user: (_parent: any, args: any) => {
      return knex("users")
        .where({ ...args })
        .first();
    },
  },
};
