import { UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import BadgeDao from "../dao/BadgeDao";
import {
  BadgeServiceAddOneInput,
  BadgeServiceEditOneInput,
  BadgeServiceGetManyArgs,
  BadgeServiceGetOneArgs,
} from "../service/BadgeService";
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
  async editOne(
    { badgeId, input }: MutationEditBadgeArgs,
    _context: ServerContext,
  ): Promise<{ badgeId: string; input: BadgeServiceEditOneInput }> {
    await this.badgeDao.getOne({ badgeId }).then((badge) => ensureExists("Badge")(badge));
    if (Object.keys(input).length === 0) {
      throw new UserInputError("Must edit at least one field!");
    }
    return { badgeId, input };
  }
  async deleteOne({ badgeId }: MutationDeleteBadgeArgs): Promise<string> {
    return this.badgeDao
      .getOne({ badgeId })
      .then((badge) => ensureExists<Badge>("Badge")(badge))
      .then(({ badgeId }) => badgeId);
  }
}
