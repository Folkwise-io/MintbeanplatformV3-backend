import {
  QueryUserArgs,
  MutationLoginArgs,
  MutationRegisterArgs,
  EditUserInput,
  MutationEditUserArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import UserDao from "../dao/UserDao";
import { ServerContext } from "../buildServerContext";
import { ApolloError, AuthenticationError } from "apollo-server-express";
import registerSchema from "./yupSchemas/registerSchema";
import loginSchema from "./yupSchemas/loginSchema";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { UserServiceAddOneArgs } from "../service/UserService";
import { User } from "../types/User";
import editUserSchema from "./yupSchemas/editUser";

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

  // async register(args, _context: ServerContext): Promise<> {

  // }

  async editOne({ id, input }: MutationEditUserArgs, _context: ServerContext): Promise<MutationEditUserArgs> {
    const user = await this.userDao.getOne({ id });

    const userId = _context.getUserId();

    if (!userId) {
      throw new AuthenticationError("You are not logged in!");
    }
    if (userId !== id) {
      throw new AuthenticationError("You are not authorized to edit this user's details.");
    }

    ensureExists("User")(user);
    validateAgainstSchema<EditUserInput>(editUserSchema, input);
    return { id, input };
  }
}
