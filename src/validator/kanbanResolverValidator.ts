import { AuthenticationError, UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanDao from "../dao/KanbanDao";
import { KanbanServiceGetManyArgs, KanbanServiceGetOneArgs } from "../service/KanbanService";
import { Kanban } from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";

export default class KanbanResolverValidator {
  constructor(private kanbanDao: KanbanDao) {}

  async getOne(args: KanbanServiceGetOneArgs, context: ServerContext): Promise<KanbanServiceGetOneArgs> {
    // get by kanbanCanonId + userId OR id
    const { id, userId, kanbanCanonId } = args;
    const isByIdArgs = !!id;
    const isByCompositeArgs = !!userId && !!kanbanCanonId;
    if (!isByIdArgs && !isByCompositeArgs)
      throw new UserInputError(
        "In order to get a kanban, you must provide either 1) a specific kanban's id, or 2) a userId and kanbanCanonId.",
      );

    let kanbanOwnerId: string | undefined = undefined;
    const isAdmin = context.getIsAdmin();

    await this.kanbanDao
      .getOne(args)
      .then((kanban) => ensureExists<Kanban>("Kanban")(kanban))
      .then((kanban) => (kanbanOwnerId = kanban.userId));

    // only admin can get kanbans of other users
    if (userId !== kanbanOwnerId && !isAdmin)
      throw new AuthenticationError("You are not authorized to view other kanbans of other users!");

    return args;
  }

  async getMany(args: KanbanServiceGetManyArgs, context: ServerContext): Promise<KanbanServiceGetManyArgs> {
    let kanbanOwnerId: string | undefined = undefined;
    // only admin can get kanbans of other users
    const isKanbanOwner = args.userId === context.getUserId();
    const isAdmin = context.getIsAdmin();

    if (!isAdmin && !isKanbanOwner)
      throw new AuthenticationError("You are not authorized to view other kanbans of other users!");
    return args;
  }

  //   async addOne(
  //     { input }: MutationCreateKanbanArgs,
  //     _context: ServerContext,
  //   ): Promise<KanbanServiceAddOneInput> {
  //     //TODO: Validate createKanban args
  //     return input;
  //   }

  //   async editOne(
  //     { id, input }: MutationEditKanbanArgs,
  //     _context: ServerContext,
  //   ): Promise<{ id: string; input: KanbanServiceEditOneInput }> {
  //     // Check if meet id exists in db
  //     await this.kanbanDao.getOne({ id }).then((meet) => ensureExists("Kanban")(meet));

  //     // Handle when input has no fields to update (knex doesn't like this)
  //     if (Object.keys(input).length === 0) {
  //       throw new UserInputError("Must edit at least one field!");
  //     }

  //     return { id, input };
  //   }

  //   async deleteOne({ id }: MutationDeleteKanbanArgs): Promise<string> {
  //     // Check if meet id exists in db
  //     return this.kanbanDao
  //       .getOne({ id })
  //       .then((meet) => ensureExists<Kanban>("Kanban")(meet))
  //       .then(({ id }) => id);
  //   }
}
