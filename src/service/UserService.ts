import { User } from "../types/User";
import bcrypt from "bcryptjs";
import UserDao, { UserDaoLoginArgs } from "../dao/UserDao";

export interface UserServiceAddOneArgs {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export default class UserService {
  constructor(private userDao: UserDao) {}

  async checkPassword(args: UserDaoLoginArgs): Promise<boolean> {
    const user = await this.userDao.getOne({ email: args.email });
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

  async getRegistrantsOfMeet(meetId: string): Promise<User[]> {
    return this.userDao.getMany({ meetId });
  }
}
