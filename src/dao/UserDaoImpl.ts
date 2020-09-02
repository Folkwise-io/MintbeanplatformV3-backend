import { User } from "../graphql/generated/tsTypes";
import Knex from "knex";
import { UserServiceGetManyArgs, UserServiceGetOneArgs } from "../service/UserService";
import UserDao from "./UserDao";

export default class UserDaoImpl implements UserDao {
  constructor(private knex: Knex) {}

  getOne(args: UserServiceGetOneArgs) {
    const user = this.knex<User>("users")
      .where({ ...args })
      .first();

    return user as Promise<User>;
  }

  getMany(args: UserServiceGetManyArgs) {
    const users = this.knex<User>("users").where({ ...args });
    return users as Promise<User[]>;
  }
}
