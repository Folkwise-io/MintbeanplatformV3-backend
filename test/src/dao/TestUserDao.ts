import UserDao from "../../../src/dao/UserDao";
import { User } from "../../../src/graphql/generated/tsTypes";
import { UserServiceGetOneArgs, UserServiceGetManyArgs } from "../../../src/service/UserService";
import { TestState } from "./TestState";

export class TestUserDao implements UserDao {
  constructor(testState: TestState) {}

  getOne(args: UserServiceGetOneArgs): Promise<User> {
    throw new Error("Method not implemented.");
  }
  getMany(args: UserServiceGetManyArgs): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
}
