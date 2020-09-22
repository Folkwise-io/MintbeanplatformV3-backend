import { QueryUserArgs, User, MutationLoginArgs, MutationRegisterArgs } from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { UserServiceAddOneArgs, UserServiceGetOneArgs, UserServiceLoginArgs } from "../service/UserService";
import UserDao from "../dao/UserDao";
import { ServerContext } from "../buildServerContext";
import { ApolloError, AuthenticationError, UserInputError } from "apollo-server-express";
import registerSchema from "./yupSchemas/registerSchema";
import loginSchema from "./yupSchemas/loginSchema";

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
      .then((user) => ensureExists<User>("User")(user))
      .then(({ id, username, email }) => ({ id, username, email }));
  }

  async addOne({ input }: MutationRegisterArgs): Promise<UserServiceAddOneArgs> {
    const { username, firstName, lastName, email, password, passwordConfirmation } = input;
    try {
      registerSchema.validateSync(input);
    } catch (e) {
      throw new UserInputError(e.message);
    }

    const userWithSameUsername = await this.userDao.getOne({ username });
    if (userWithSameUsername) {
      throw new ApolloError("Username taken!");
    }

    const userWithSameEmail = await this.userDao.getOne({ email });
    if (userWithSameEmail) {
      throw new ApolloError("Email taken!");
    }

    return { username, firstName, lastName, email, password };
  }

  async login({ email, password }: MutationLoginArgs, context: ServerContext): Promise<UserServiceLoginArgs> {
    try {
      loginSchema.validateSync({ email, password });
    } catch (e) {
      throw new ApolloError(e.message);
    }

    return { email, password };
  }
}
