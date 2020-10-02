import { User } from "../types/user";
import { EntityService } from "./EntityService";
import bcrypt from "bcryptjs";
import UserDao from "../dao/UserDao";

export interface UserServiceGetOneArgs {
  id?: string | null;
  email?: string | null;
}

export interface UserServiceGetManyArgs {
  firstName?: string | null;
  lastName?: string | null;
  meetId?: string;
}

export interface UserServiceLoginArgs {
  email: string;
  password: string;
}

export interface UserServiceAddOneArgs {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export default class UserService implements EntityService<User> {
  constructor(private userDao: UserDao) {}

  async getOne(args: UserServiceGetOneArgs): Promise<User> {
    return this.userDao.getOne(args);
  }

  async getMany(args: UserServiceGetManyArgs): Promise<User[]> {
    return this.userDao.getMany(args);
  }

  async checkPassword(args: UserServiceLoginArgs): Promise<boolean> {
    const user: User = await this.userDao.getOne({ email: args.email });
    if (!user) {
      return false;
    }

    const correctPassword = await bcrypt.compare(args.password, user.passwordHash);
    if (!correctPassword) {
      return false;
    }
    return true;
  }

  async addOne(args: UserServiceAddOneArgs): Promise<User> {
    const { email, firstName, lastName, password } = args;
    const passwordHash = bcrypt.hashSync(password, 10);
    return this.userDao.addOne({ email, firstName, lastName, passwordHash });
  }
}
