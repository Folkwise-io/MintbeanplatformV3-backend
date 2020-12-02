import { User } from "../types/User";

export interface UserDaoAddOneArgs {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}

export interface UserDaoGetOneArgs {
  id?: string | null;
  email?: string | null;
}

export interface UserDaoGetManyArgs {
  firstName?: string | null;
  lastName?: string | null;
  meetId?: string;
}

export interface UserDaoLoginArgs {
  email: string;
  password: string;
}

export default interface UserDao {
  getOne(args: UserDaoGetOneArgs): Promise<User | undefined>;
  getMany(args: UserDaoGetManyArgs): Promise<User[]>;
  addOne(args: UserDaoAddOneArgs): Promise<User>;
}
