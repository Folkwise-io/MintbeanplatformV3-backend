import { QueryUsersArgs, User } from "../graphql/generated/tsTypes";

import { EntityService } from "./EntityService";

export interface UserServiceGetOneArgs {
  id?: string | null;
  username?: string | null;
}

export default class UserService implements EntityService<User> {
  constructor(private userDao: any) {}

  getMany(args: QueryUsersArgs): User[] {
    // TODO: validate args, validate permissions?
    return this.userDao.getMany(args);
  }

  getOne(args: UserServiceGetOneArgs): User {
    return this.userDao.getOne(args);
  }
}
