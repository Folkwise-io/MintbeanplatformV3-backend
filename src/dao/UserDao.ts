import { User } from "../graphql/generated/tsTypes";
import { UserServiceGetManyArgs, UserServiceGetOneArgs } from "../service/UserService";

export default interface UserDao {
  getOne(args: UserServiceGetOneArgs): Promise<User>;
  getMany(args: UserServiceGetManyArgs): Promise<User[]>;

  // Testing methods for TestManager to call
  addUsers(users: User[]): Promise<void>;
  deleteAll(): Promise<void>;
}
