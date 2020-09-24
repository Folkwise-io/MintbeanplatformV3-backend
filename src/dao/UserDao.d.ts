import { User } from "../types/gqlGeneratedTypes";
import { UserServiceAddOneArgs, UserServiceGetManyArgs, UserServiceGetOneArgs } from "../service/UserService";

interface UserDaoAddOneArgs {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}

export default interface UserDao {
  getOne(args: UserServiceGetOneArgs): Promise<User>;
  getMany(args: UserServiceGetManyArgs): Promise<User[]>;
  addOne(args: UserDaoAddOneArgs): Promise<User>;
  // Testing methods for TestManager to call
  addMany(users: User[]): Promise<void>;
  deleteAll(): Promise<void>;
  destroy(): Promise<void>; // Needed to terminate knex so tests don't hang
}
