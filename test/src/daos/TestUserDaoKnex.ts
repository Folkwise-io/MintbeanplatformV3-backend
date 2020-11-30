import Knex from "knex";
import UserDaoKnex from "../../../src/dao/UserDaoKnex";
import { User } from "../../../src/types/User";

export default class TestUserDaoKnex extends UserDaoKnex {
  constructor(knex: Knex) {
    super(knex);
  }

  async addMany(users: User[]): Promise<void> {
    return this.knex<User>("users").insert(users);
  }

  async deleteAll(): Promise<void> {
    return this.knex<User>("users").delete();
  }

  // used in Test manager destroy - not sure why
  async destroy(): Promise<void> {
    return this.knex.destroy();
  }
}
