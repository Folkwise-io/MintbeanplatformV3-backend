import ValidatorDao from "../dao/ValidatorDao";
import { QueryUserArgs } from "../graphql/generated/tsTypes";
import { ApolloError } from "apollo-server-express";

export default class UserValidator {
  constructor(private validatorDao: ValidatorDao) {}

  async validateOne(args: QueryUserArgs, context: any): Promise<QueryUserArgs> {
    const doesUserExist = await this.validatorDao.doesUserExist(args.id);
    
    if (!doesUserExist) {
      throw new ApolloError("User does not exist");
    } else {
      return args;
    }
  }
}
