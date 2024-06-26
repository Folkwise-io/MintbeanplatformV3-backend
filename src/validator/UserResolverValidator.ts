import { QueryUserArgs, MutationLoginArgs, MutationRegisterArgs } from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import UserDao from "../dao/UserDao";
import { ServerContext } from "../buildServerContext";
import { ApolloError } from "apollo-server-express";
import registerSchema from "./yupSchemas/registerSchema";
import loginSchema from "./yupSchemas/loginSchema";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { UserServiceAddOneArgs } from "../service/UserService";

export default class UserResolverValidator {
  constructor(private userDao: UserDao) {}

  async getOne(args: QueryUserArgs, _context: ServerContext): Promise<QueryUserArgs> {
    const user = await this.userDao.getOne(args);
    ensureExists("User")(user);
    return args;
  }

  async addOne({ input }: MutationRegisterArgs): Promise<MutationRegisterArgs> {
    validateAgainstSchema<UserServiceAddOneArgs>(registerSchema, input);

    const { email } = input;
    const userWithSameEmail = await this.userDao.getOne({ email });
    if (userWithSameEmail) {
      throw new ApolloError("Email taken!");
    }

    return { input };
  }

  async login(args: MutationLoginArgs, _context: ServerContext): Promise<MutationLoginArgs> {
    validateAgainstSchema<MutationLoginArgs>(loginSchema, args);

    return args;
  }
}
