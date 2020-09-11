import { User } from "../types/gqlGeneratedTypes";
import Knex from "knex";
import { UserServiceGetManyArgs, UserServiceGetOneArgs } from "../service/UserService";
import UserDao from "./UserDao";

export default class UserDaoKnex implements UserDao {
  constructor(private knex: Knex) {}
  async getOne(args: UserServiceGetOneArgs): Promise<User> {
    const user = this.knex<User>("users")
      .where({ ...args })
      .first();

    return user as Promise<User>;
  }

  async getMany(args: UserServiceGetManyArgs): Promise<User[]> {
    return this.knex<User>("users")
      .where({ ...args })
      .orderBy("username");
  }

  async addUsers(users: User[]): Promise<void> {
    return this.knex<User>("users").insert(users);
  }

  async deleteAll(): Promise<void> {
    return this.knex<User>("users").delete();
  }

  async destroy(): Promise<void> {
    return this.knex.destroy();
  }
}
