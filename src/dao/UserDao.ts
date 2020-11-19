import { User } from "../types/User";
import { UserServiceGetManyArgs, UserServiceGetOneArgs } from "../service/UserService";

export interface UserDaoAddOneArgs {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}

export default interface UserDao {
  getOne(args: UserServiceGetOneArgs): Promise<User | undefined>;
  getMany(args: UserServiceGetManyArgs): Promise<User[]>;
  addOne(args: UserDaoAddOneArgs): Promise<User>;
}
