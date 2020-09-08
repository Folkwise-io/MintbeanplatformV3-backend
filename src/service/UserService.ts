import { User } from "../types/gqlGeneratedTypes";

import { EntityService } from "./EntityService";

export interface UserServiceGetOneArgs {
  id?: string | null;
  username?: string | null;
}

export interface UserServiceGetManyArgs {
  firstName?: string | null;
  lastName?: string | null;
}

export default class UserService implements EntityService<User> {
  constructor(private userDao: any) {}

  getOne(args: UserServiceGetOneArgs): User {
    return this.userDao.getOne(args);
  }

  getMany(args: UserServiceGetManyArgs): User[] {    
    return this.userDao.getMany(args);
  }
}
