import {
  QueryUsersArgs,
  User,
  QueryUserArgs,
} from "../graphql/generated/tsTypes";
import Knex from "knex";

export default class UserDao {
  constructor(private knex: Knex) {}
  getMany(args: QueryUsersArgs) {
    return this.knex<User>("users").where({ ...args });
  }

  getOne(args: QueryUserArgs) {
    return this.knex<User>("users")
      .where({ ...args })
      .first();
  }
}
