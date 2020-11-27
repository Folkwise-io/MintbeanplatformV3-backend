import { QueryUserArgs, MutationLoginArgs, MutationRegisterArgs } from "../types/gqlGeneratedTypes";
import { User } from "../types/User";
import { ensureExists } from "../util/ensureExists";
import UserDao, { UserDaoGetOneArgs, UserDaoLoginArgs } from "../dao/UserDao";
import { ServerContext } from "../buildServerContext";
import { ApolloError } from "apollo-server-express";
import registerSchema from "./yupSchemas/registerSchema";
import loginSchema from "./yupSchemas/loginSchema";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { UserServiceAddOneArgs } from "../service/UserService";

export default class UserResolverValidator {
  constructor(private userDao: UserDao) {}

  getOne(args: QueryUserArgs, context: ServerContext): Promise<UserDaoGetOneArgs> {
    return this.userDao
      .getOne(args)
      .then((user) => ensureExists<User>("User")(user))
      .then(({ id, email }) => ({ id, email }));
  }

  async addOne({ input }: MutationRegisterArgs): Promise<UserServiceAddOneArgs> {
    validateAgainstSchema<UserServiceAddOneArgs>(registerSchema, input);

    const { email } = input;
    const userWithSameEmail = await this.userDao.getOne({ email });
    if (userWithSameEmail) {
      throw new ApolloError("Email taken!");
    }

    return input;
  }

  async login(args: MutationLoginArgs, _context: ServerContext): Promise<UserDaoLoginArgs> {
    validateAgainstSchema<UserDaoLoginArgs>(loginSchema, args);

    return args;
  }
}
