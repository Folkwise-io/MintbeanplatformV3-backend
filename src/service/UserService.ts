import { User } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";
import bcrypt from "bcryptjs";
import { AuthenticationError } from "apollo-server-express";
import UserDao from "../dao/UserDao";
import { ServerContext } from "../buildContext";

export interface UserServiceGetOneArgs {
  id?: string | null;
  username?: string | null;
  email?: string | null;
}

export interface UserServiceGetManyArgs {
  firstName?: string | null;
  lastName?: string | null;
}

export interface UserServiceLoginArgs {
  email: string;
  password: string;
}

export default class UserService implements EntityService<User> {
  constructor(private userDao: UserDao) {}

  async getOne(args: UserServiceGetOneArgs, context: ServerContext): Promise<User> {
    return this.userDao.getOne(args);
  }

  async getMany(args: UserServiceGetManyArgs, context: ServerContext): Promise<User[]> {
    return this.userDao.getMany(args);
  }

  async login(args: UserServiceLoginArgs, context: ServerContext): Promise<User> {
    const user: User = await this.userDao.getOne({ email: args.email });
    const correctPassword = await bcrypt.compare(args.password, user.passwordHash);
    if (!correctPassword) {
      throw new AuthenticationError("Login failed!");
    }
    return user;
  }
}
