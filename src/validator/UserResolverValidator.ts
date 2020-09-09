import { QueryUserArgs, User } from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { UserServiceGetOneArgs } from "../service/UserService";
import UserDao from "../dao/UserDao";
import { ServerContext } from "../types/ServerContext";

export default class UserResolverValidator {
  constructor(private userDao: UserDao) {}

  /**
   * This is only an example validator that checks if the user exists and throws an error if the user does not.
   * This "validation" is unnecessary because without it, graphQL would just return null which is probably better.
   * @param args The args passed in from the resolver
   * @param context The context passed in from the resolver (useful for authorization checks in other validators)
   * @returns The cleaned args as defined in UserService
   */
  getOne(args: QueryUserArgs, context: ServerContext): Promise<UserServiceGetOneArgs> {
    return this.userDao
      .getOne(args)
      .then((user) => <User>ensureExists("User")(user))
      .then(({ id, username }) => ({ id, username }));
  }
}
