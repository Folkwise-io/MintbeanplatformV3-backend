import { AuthenticationError, UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanCanonCardDao from "../dao/KanbanCanonCardDao";
import KanbanCanonDao from "../dao/KanbanCanonDao";
import KanbanDao from "../dao/KanbanDao";
import MeetDao from "../dao/MeetDao";
import UserDao from "../dao/UserDao";
import { KanbanCanonServiceUpdateCardPositionsInput } from "../service/KanbanCanonService";
import { KanbanServiceGetManyArgs, KanbanServiceGetOneArgs } from "../service/KanbanService";
import {
  Kanban,
  KanbanCanon,
  Meet,
  MutationCreateKanbanArgs,
  MutationDeleteKanbanArgs,
  MutationUpdateKanbanCanonCardPositionsArgs,
} from "../types/gqlGeneratedTypes";
import { User } from "../types/User";
import { ensureExists } from "../util/ensureExists";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { updateKanbanCardPositionsInputSchema } from "./yupSchemas/kanbanCanon";

export default class KanbanResolverValidator {
  constructor(
    private kanbanDao: KanbanDao,
    private kanbanCanonDao: KanbanCanonDao,
    private kanbanCanonCardDao: KanbanCanonCardDao,
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

    const requesterId = context.getUserId();
    if (!requesterId) {
      throw new AuthenticationError("You must be logged in to create a kanban!");
    }

    // ensure requesting user is the input user if not admin
    const isAdmin = context.getIsAdmin();
    if (!isAdmin && requesterId !== userId) {
      throw new AuthenticationError("You cannot create kanbans for users other than yourself!");
    }

    // ensure kanbanCanon exists
    await this.kanbanCanonDao
      .getOne({ id: kanbanCanonId })
      .then((kanbanCanon) => ensureExists<KanbanCanon>("Kanban Canon")(kanbanCanon));

    // ensure input user exists
    await this.userDao.getOne({ id: userId }).then((user) => ensureExists<User>("User")(user));

    // ensure meet exists (if passed in input)
    if (meetId) {
      await this.meetDao.getOne({ id: meetId }).then((meet) => ensureExists<Meet>("Meet")(meet));
    }

    return { input };
  }

  async updateKanbanCardPositions(
    { id, input }: MutationUpdateKanbanCanonCardPositionsArgs,
    context: ServerContext,
  ): Promise<MutationUpdateKanbanCanonCardPositionsArgs> {
    // TODO: check that requester is kanban owner

    // if (!context.getIsAdmin()) {
    //   throw new AuthenticationError("You are not authorized to edit kanban canons!");
    // }

    validateAgainstSchema<KanbanCanonServiceUpdateCardPositionsInput>(updateKanbanCardPositionsInputSchema, input);

    // Check if kanban canon id exists in db
    const kanban = (await this.kanbanDao.getOne({ id }).then((kanban) => ensureExists("Kanban")(kanban))) as Kanban;

    // ensure that the requester is the kanban owner
    const kanbanOwnerId = kanban.userId;
    const currUserId = context.getUserId();

    if (currUserId !== kanbanOwnerId)
      throw new AuthenticationError("You are not authorized to update a kanban of another user!");

    await this.kanbanCanonCardDao
      .getOne({ id: input.cardId })
      .then((kanbanCanonCard) => ensureExists("Kanban CanonCard")(kanbanCanonCard));

    return { id, input };
  }

  async deleteOne({ id }: MutationDeleteKanbanArgs, context: ServerContext): Promise<MutationDeleteKanbanArgs> {
    // Check if kanban id exists in db
    const existingKanban = await this.kanbanDao.getOne({ id }).then((kanban) => ensureExists<Kanban>("Kanban")(kanban));
    // Make sure requester has permission to delete this kanban
    const requesterId = context.getUserId();
    const isAdmin = context.getIsAdmin();
    if (!isAdmin && requesterId !== existingKanban.userId) {
      throw new AuthenticationError("You cannot delete a kanban owned by another user!");
    }
    return { id };
  }
}
