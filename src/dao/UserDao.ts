import {
  QueryUsersArgs,
  User,
  QueryUserArgs,
} from "../graphql/generated/tsTypes";
import { knex } from "../db/knex";

export default class UserDao {
  getUsers(args: QueryUsersArgs) {
    return knex<User>("users").where({ ...args });
  }

  getUser(args: QueryUserArgs) {
    return knex<User>("users")
      .where({ ...args })
      .first();
  }
}
