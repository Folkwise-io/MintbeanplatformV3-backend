import { User } from "../types/gqlGeneratedTypes";
import Knex from "knex";
import { UserServiceGetManyArgs, UserServiceGetOneArgs } from "../service/UserService";
import UserDao, { UserDaoAddOneArgs } from "./UserDao";

export default class UserDaoKnex implements UserDao {
  constructor(private knex: Knex) {}
  async getOne(args: UserServiceGetOneArgs): Promise<User> {
    const user = this.knex("users")
      .where({ ...args, deleted: false })
      .first();
    return user as Promise<User>;
  }

  async getMany(args: UserServiceGetManyArgs): Promise<User[]> {
    return this.knex("users")
      .where({ ...args, deleted: false })
      .orderBy("username");
  }

  async addOne(args: UserDaoAddOneArgs): Promise<User> {
    const insertedUsers = (await this.knex<User>("users").insert(args).returning("*")) as User[];
    // console.log(insertedUsers);
    return insertedUsers[0];
  }

  // Testing methods below, for TestManager to call
  async addMany(users: User[]): Promise<void> {
    return this.knex<User>("users").insert(users);
  }

  async deleteAll(): Promise<void> {
    return this.knex<User>("users").delete();
  }

  async destroy(): Promise<void> {
    return this.knex.destroy();
  }
}
