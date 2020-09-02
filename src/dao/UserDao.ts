import { User } from "../graphql/generated/tsTypes";
import Knex from "knex";
import { UserServiceGetManyArgs, UserServiceGetOneArgs } from "../service/UserService";

export default class UserDao {
  constructor(private knex: Knex) {}

  getOne(args: UserServiceGetOneArgs) {
    return this.knex<User>("users")
      .where({ ...args })
      .first();
  }
  getMany(args: UserServiceGetManyArgs) {
    return this.knex<User>("users").where({ ...args });
  }
}
