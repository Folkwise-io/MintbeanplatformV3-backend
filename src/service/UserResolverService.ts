import {
  QueryUsersArgs,
  User,
  QueryUserArgs,
} from "../graphql/generated/tsTypes";

interface Args {
  [key: string]: string;
}

interface ResolverService<T> {
  getMany: (args: Args) => T[];
  getOne: (args: Args) => T;
}

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
