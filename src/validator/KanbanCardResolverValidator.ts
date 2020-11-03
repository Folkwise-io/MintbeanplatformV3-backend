import { AuthenticationError, UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanCanonCardDao from "../dao/KanbanCanonCardDao";
import KanbanCardDao from "../dao/KanbanCardDao";
import KanbanDao from "../dao/KanbanDao";
import { KanbanCardServiceGetManyArgs } from "../service/KanbanCardService";
import {
  Kanban,
  KanbanCanonCard,
  KanbanCanonCardStatusEnum,
  MutationUpdateKanbanCardArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";

export default class KanbanCardResolverValidator {
  constructor(
    private kanbanCardDao: KanbanCardDao,
    private kanbanDao: KanbanDao,
    private kanbanCanonCardDao: KanbanCanonCardDao,
  ) {}

  async getMany(
    { kanbanId }: KanbanCardServiceGetManyArgs,
    _context: ServerContext,
  ): Promise<KanbanCardServiceGetManyArgs> {
    await this.kanbanDao.getOne({ id: kanbanId }).then((kanban) => ensureExists<Kanban>("Kanban")(kanban));
    return { kanbanId };
  }
  async updateOne(
    { input }: MutationUpdateKanbanCardArgs,
    context: ServerContext,
  ): Promise<MutationUpdateKanbanCardArgs> {
    const { id, kanbanId, status } = input;

    if (!Object.values(KanbanCanonCardStatusEnum).includes(status)) {
      throw new UserInputError(`Invalid status provided: "${status}"`);
    }

    // make sure kanbanCanonCard exists (note: kanban card and kanbanCanonCard share the same id)
    const kanbanCanonCard = await this.kanbanCanonCardDao
      .getOne({ id })
      .then((kanbanCanonCard) => ensureExists<KanbanCanonCard>("Kanban Canon Card")(kanbanCanonCard));

    // make sure kanban exists
    const kanban = await this.kanbanDao
      .getOne({ id: kanbanId })
      .then((kanban) => ensureExists<Kanban>("Kanban")(kanban));

    // make sure requester is the kanban card owner
    const requesterId = context.getUserId();
    if (requesterId !== kanban.userId) {
      throw new AuthenticationError("You are not authorized to update a kanban card owned by another user!");
    }

    // make sure kanban and kanbanCanonCard are related via the same kanbanCanon
    if (kanbanCanonCard.kanbanCanonId !== kanban.kanbanCanonId) {
      throw new UserInputError("Kanban Canon Card and Kanban are not related");
    }

    return { input };
  }
}
