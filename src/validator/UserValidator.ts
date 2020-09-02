import { QueryUserArgs, User } from "../graphql/generated/tsTypes";
import { ensureExists } from "../util/ensureExists";
import UserDao from "../dao/UserDao";

interface UserServiceGetOneParams {
  id?: string | null;
  username?: string | null;
}

export default class UserValidator {
  constructor(private userDao: UserDao) {}

  /**
   * This is only an example validator that checks if the user exists and throws an error if the user does not.
   * This "validation" is unnecessary because without it, graphQL would just return null which is probably better.
   * @param args The args passed in from the resolver
   * @param context The context passed in from the resolver (useful for authorization checks in other validators)
   */
  getOne(args: QueryUserArgs, context: any): Promise<UserServiceGetOneParams> {
    return this.userDao
      .getOne(args)
      .then((user) => <User>ensureExists("User")(user))
      .then(({ id, username }) => ({ id, username }));
  }
}
