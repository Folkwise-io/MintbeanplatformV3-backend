import { knex } from "../../db/knex";

export default {
  Query: {
    users: () => {
      return knex("users");
    },

    user: (_parent: any, args: any) => {
      return knex("users")
        .where({ ...args })
        .first();
    },
  },
};
