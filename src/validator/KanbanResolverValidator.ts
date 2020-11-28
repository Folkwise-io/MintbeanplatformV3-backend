import { AuthenticationError, UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanCanonCardDao from "../dao/KanbanCanonCardDao";
import KanbanCanonDao, { KanbanCanonDaoUpdateCardPositionsInput } from "../dao/KanbanCanonDao";
import KanbanDao, { KanbanDaoGetManyArgs, KanbanDaoGetOneArgs } from "../dao/KanbanDao";
import MeetDao from "../dao/MeetDao";
import UserDao from "../dao/UserDao";
import {
  Kanban,
  MutationCreateKanbanArgs,
  KanbanCanon,
  Meet,
  MutationUpdateKanbanCanonCardPositionsArgs,
  MutationDeleteKanbanArgs,
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

  async getOne(args: KanbanDaoGetOneArgs, context: ServerContext): Promise<KanbanDaoGetOneArgs> {
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

    const kanban = await this.kanbanDao.getOne(args);
    ensureExists<Kanban>("Kanban")(kanban);
    // only admin can get kanbans of other users
    const isAdmin = context.getIsAdmin();
    const isOwner = context.getUserId() === kanban?.userId;
    if (!isOwner && !isAdmin) {
      throw new AuthenticationError("You are not authorized to view other kanbans of other users!");
    }

    return args;
  }

  async getMany(args: KanbanDaoGetManyArgs, context: ServerContext): Promise<KanbanDaoGetManyArgs> {
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
    validateAgainstSchema<KanbanCanonDaoUpdateCardPositionsInput>(updateKanbanCardPositionsInputSchema, input);

    // Check if kanban canon id exists in db
    const kanban = await this.kanbanDao.getOne({ id });
    ensureExists("Kanban")(kanban);

    // ensure that the requester is the kanban owner
    const kanbanOwnerId = kanban?.userId;
    const currUserId = context.getUserId();

    if (currUserId !== kanbanOwnerId) throw new AuthenticationError("You are not authorized to edit this kanban!");

    const kanbanCanonCard = await this.kanbanCanonCardDao.getOne({ id: input.cardId });
    ensureExists("Kanban CanonCard")(kanbanCanonCard);

    return { id, input };
  }

  async deleteOne({ id }: MutationDeleteKanbanArgs, context: ServerContext): Promise<MutationDeleteKanbanArgs> {
    // Check if kanban id exists in db
    const existingKanban = await this.kanbanDao.getOne({ id });
    ensureExists<Kanban>("Kanban")(existingKanban);
    // Make sure requester has permission to delete this kanban
    const requesterId = context.getUserId();
    const isAdmin = context.getIsAdmin();
    if (!isAdmin && requesterId !== existingKanban?.userId) {
      throw new AuthenticationError("You are not authorized to delete this kanban!");
    }
    return { id };
  }
}
