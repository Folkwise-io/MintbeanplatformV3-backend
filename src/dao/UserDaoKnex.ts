import { User } from "../types/User";
import Knex from "knex";
import UserDao, { UserDaoAddOneArgs, UserDaoEditOneInput, UserDaoGetManyArgs, UserDaoGetOneArgs } from "./UserDao";
import handleDatabaseError from "../util/handleDatabaseError";

export default class UserDaoKnex implements UserDao {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getOne(args: UserDaoGetOneArgs): Promise<User | undefined> {
    return handleDatabaseError(async () => {
      const user = await this.knex("users")
        .where({ ...args, deleted: false })
        .first();
      return user;
    });
  }

  async getMany(args: UserDaoGetManyArgs): Promise<User[]> {
    return handleDatabaseError(() => {
      const { meetId } = args;
      // Use meetRegistrations join table to get registrants
      if (meetId) {
        return this.knex
          .select("users.*")
          .from("users")
          .join("meetRegistrations", "meetRegistrations.userId", "=", "users.id")
          .where({ "meetRegistrations.meetId": meetId })
          .orderBy("firstName");
      }

      return this.knex("users")
        .where({ ...args, deleted: false })
        .orderBy("firstName");
    });
  }

  async addOne(args: UserDaoAddOneArgs): Promise<User> {
    return handleDatabaseError(async () => {
      const insertedUsers = (await this.knex<User>("users").insert(args).returning("*")) as User[];
      return insertedUsers[0];
    });
  }

  async editOne(id: string, input: UserDaoEditOneInput): Promise<User> {
    return handleDatabaseError(async () => {
      const updatedUser = (await this.knex("users")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as User[];
      return updatedUser[0];
    });
  }
}
