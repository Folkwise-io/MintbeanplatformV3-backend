import UserDao from "../../../src/dao/UserDao";
import { User } from "../../../src/graphql/generated/tsTypes";
import { UserServiceGetOneArgs, UserServiceGetManyArgs } from "../../../src/service/UserService";
import { TestState } from "./TestState";

export class TestUserDao implements UserDao {
  constructor(private testState: TestState) {}

  getOne(args: UserServiceGetOneArgs): Promise<User> {
    throw new Error("Method not implemented.");
  }
  async getMany(args: UserServiceGetManyArgs): Promise<User[]> {
    return this.testState.users;
    // throw new Error("Method not implemented.");
  }
}
