import { User } from "../types/gqlGeneratedTypes";
import Knex from "knex";
import { UserServiceGetManyArgs, UserServiceGetOneArgs } from "../service/UserService";
import UserDao from "./UserDao";

export default class UserDaoKnex implements UserDao {
  constructor(private knex: Knex) {}
  getOne(args: UserServiceGetOneArgs) {
    const user = this.knex<User>("users")
      .where({ ...args })
      .first();

    return user as Promise<User>;
  }

  getMany(args: UserServiceGetManyArgs) {
    const users = this.knex<User>("users")
      .where({ ...args })
      .orderBy("username");
    return users as Promise<User[]>;
  }

  addUsers(users: User[]): Promise<void> {
    return this.knex<User>("users").insert(users);
  }

  deleteAll(): Promise<void> {
    return this.knex<User>("users").delete();
  }

  destroy(): Promise<void> {
    return this.knex.destroy();
  }
}
