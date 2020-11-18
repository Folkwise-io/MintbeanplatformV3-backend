import { UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import BadgeDao from "../dao/BadgeDao";
import { BadgeServiceAddOneInput, BadgeServiceEditOneInput, BadgeServiceGetManyArgs } from "../service/BadgeService";
import {
  QueryBadgeArgs,
  MutationCreateBadgeArgs,
  MutationEditBadgeArgs,
  MutationDeleteBadgeArgs,
  Badge,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import createBadgeInputSchema from "./yupSchemas/createBadgeInputSchema";

export default class BadgeResolverValidator {
  constructor(private badgeDao: BadgeDao) {}
  async getMany(args: {}, _context: ServerContext): Promise<BadgeServiceGetManyArgs> {
    return args;
  }
  async getOne(args: QueryBadgeArgs, _context: ServerContext): Promise<QueryBadgeArgs> {
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
  async editOne(
    { id, input }: MutationEditBadgeArgs,
    _context: ServerContext,
  ): Promise<{ id: string; input: BadgeServiceEditOneInput }> {
    await this.badgeDao.getOne({ id }).then((badge) => ensureExists("Badge")(badge));
    if (Object.keys(input).length === 0) {
      throw new UserInputError("Must edit at least one field!");
    }
    return { id, input };
  }
  async deleteOne({ id }: MutationDeleteBadgeArgs): Promise<string> {
    return this.badgeDao
      .getOne({ id })
      .then((badge) => ensureExists("Badge")(badge))
      .then(({ id }) => id);
  }
}
