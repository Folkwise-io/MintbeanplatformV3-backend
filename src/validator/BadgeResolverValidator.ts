import { UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import { BadgeServiceAddOneInput, BadgeServiceGetManyArgs, BadgeServiceGetOneArgs } from "../service/BadgeService";
import { QueryBadgeArgs, MutationCreateBadgeArgs } from "../types/gqlGeneratedTypes";
import createBadgeInputSchema from "./yupSchemas/createBadgeInputSchema";

export default class BadgeResolverValidator {
  async getMany(args: {}, _context: ServerContext): Promise<BadgeServiceGetManyArgs> {
    return args;
  }
  async getOne(args: QueryBadgeArgs, _context: ServerContext): Promise<BadgeServiceGetOneArgs> {
    return args;
  }
  async addOne({ input }: MutationCreateBadgeArgs, _context: ServerContext): Promise<BadgeServiceAddOneInput> {
    try {
      createBadgeInputSchema.validateSync(input);
    } catch (e) {
      throw new UserInputError(e.message);
    }
    return input;
  }
}
