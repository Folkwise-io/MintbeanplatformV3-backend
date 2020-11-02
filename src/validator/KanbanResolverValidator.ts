import { AuthenticationError, UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanCanonDao from "../dao/KanbanCanonDao";
import KanbanDao from "../dao/KanbanDao";
import MeetDao from "../dao/MeetDao";
import UserDao from "../dao/UserDao";
import { KanbanServiceGetManyArgs, KanbanServiceGetOneArgs } from "../service/KanbanService";
import { Kanban, KanbanCanon, Meet, MutationCreateKanbanArgs } from "../types/gqlGeneratedTypes";
import { User } from "../types/User";
import { ensureExists } from "../util/ensureExists";

export default class KanbanResolverValidator {
  constructor(
    private kanbanDao: KanbanDao,
    private kanbanCanonDao: KanbanCanonDao,
    private userDao: UserDao,
    private meetDao: MeetDao,
  ) {}

  async getOne(args: KanbanServiceGetOneArgs, context: ServerContext): Promise<KanbanServiceGetOneArgs> {
    const isLoggedIn = !!context.getUserId();
    if (!isLoggedIn) throw new AuthenticationError("You must be logged in to see kanbans!");

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
    const currUserId = context.getUserId();

    await this.kanbanDao
      .getOne(args)
      .then((kanban) => ensureExists<Kanban>("Kanban")(kanban))
      .then((kanban) => (kanbanOwnerId = kanban.userId));

    // only admin can get kanbans of other users
    if (currUserId !== kanbanOwnerId && !isAdmin)
      throw new AuthenticationError("You are not authorized to view other kanbans of other users!");

    return args;
  }

  async getMany(args: KanbanServiceGetManyArgs, context: ServerContext): Promise<KanbanServiceGetManyArgs> {
    // only admin can get kanbans of other users
    const isKanbanOwner = args.userId === context.getUserId();
    const isAdmin = context.getIsAdmin();

    if (!isAdmin && !isKanbanOwner)
      throw new AuthenticationError("You are not authorized to view other kanbans of other users!");
    return args;
  }

  async addOne({ input }: MutationCreateKanbanArgs, context: ServerContext): Promise<MutationCreateKanbanArgs> {
    const { kanbanCanonId, userId, meetId } = input;
    if (!context.getUserId()) {
      throw new UserInputError("You must be logged in to create a kanban!");
    }
    // ensure kanbanCanon  exists
    await this.kanbanCanonDao
      .getOne({ id: kanbanCanonId })
      .then((kanbanCanon) => ensureExists<KanbanCanon>("Kanban Canon")(kanbanCanon));
    // ensure user exists
    await this.userDao.getOne({ id: userId }).then((user) => ensureExists<User>("User")(user));
    // ensure meet exists (if passed in input)
    if (meetId) {
      await this.meetDao.getOne({ id: meetId }).then((meet) => ensureExists<Meet>("Meet")(meet));
    }
    return { input };
  }

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
