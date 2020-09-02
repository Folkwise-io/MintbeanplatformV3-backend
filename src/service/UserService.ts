import {
  QueryUsersArgs,
  User,
  QueryUserArgs,
} from "../graphql/generated/tsTypes";

import { EntityService } from "./EntityService";

export default class UserService implements EntityService<User> {
  constructor(private userDao: any) {}

  getMany(args: QueryUsersArgs): User[] {
    // TODO: validate args, validate permissions?
    return this.userDao.getMany(args);
  }

  getOne(args: QueryUserArgs): User {
    return this.userDao.getOne(args);
  }
}
