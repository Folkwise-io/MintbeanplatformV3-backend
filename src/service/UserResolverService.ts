import {
  QueryUsersArgs,
  User,
  QueryUserArgs,
} from "../graphql/generated/tsTypes";

import { ResolverService } from "./ResolverService";

export default class UserResolverService implements ResolverService<User> {
  constructor(private userDao: any) {}

  getMany(args: QueryUsersArgs): User[] {
    // TODO: validate args, validate permissions?
    return this.userDao.getMany(args);
  }

  getOne(args: QueryUserArgs): User {
    return this.userDao.getOne(args);
  }
}
