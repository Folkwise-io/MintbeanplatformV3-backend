import { AuthenticationError, UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import BadgeDao from "../dao/BadgeDao";
import { BadgeServiceAddOneInput, BadgeServiceEditOneInput, BadgeServiceGetManyArgs } from "../service/BadgeService";
import {
  QueryBadgeArgs,
  MutationCreateBadgeArgs,
  MutationEditBadgeArgs,
  MutationDeleteBadgeArgs,
  CreateBadgeInput,
  EditBadgeInput,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { validateAtLeastOneFieldPresent } from "../util/validateAtLeastOneFieldPresent";
import { createBadgeInputSchema, editBadgeInputSchema } from "./yupSchemas/badge";

export default class BadgeResolverValidator {
  constructor(private badgeDao: BadgeDao) {}
  async getMany(args: {}, _context: ServerContext): Promise<BadgeServiceGetManyArgs> {
    return args;
  }
  async getOne(args: QueryBadgeArgs, _context: ServerContext): Promise<QueryBadgeArgs> {
    return args;
  }
  async addOne({ input }: MutationCreateBadgeArgs, _context: ServerContext): Promise<BadgeServiceAddOneInput> {
    if (!_context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to create a badge!");
    }
    validateAgainstSchema<CreateBadgeInput>(createBadgeInputSchema, input);

    return input;
  }
  async editOne(
    { id, input }: MutationEditBadgeArgs,
    _context: ServerContext,
  ): Promise<{ id: string; input: BadgeServiceEditOneInput }> {
    if (!_context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to edit a badge!");
    }
    const badge = await this.badgeDao.getOne({ id });
    ensureExists("Badge")(badge);
    validateAtLeastOneFieldPresent(input);
    validateAgainstSchema<EditBadgeInput>(editBadgeInputSchema, input);

    return { id, input };
  }
  async deleteOne({ id }: MutationDeleteBadgeArgs, _context: ServerContext): Promise<string> {
    if (!_context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to edit a badge!");
    }
    const badge = await this.badgeDao.getOne({ id });
    ensureExists("Badge")(badge);
    return id;
  }
}
