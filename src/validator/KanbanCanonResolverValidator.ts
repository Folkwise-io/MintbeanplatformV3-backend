import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanCanonCardDao from "../dao/KanbanCanonCardDao";
import KanbanCanonDao, {
  KanbanCanonDaoAddOneInput,
  KanbanCanonDaoEditOneInput,
  KanbanCanonDaoUpdateCardPositionsInput,
} from "../dao/KanbanCanonDao";

import {
  MutationCreateKanbanCanonArgs,
  MutationEditKanbanCanonArgs,
  MutationUpdateKanbanCanonCardPositionsArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { validateAtLeastOneFieldPresent } from "../util/validateAtLeastOneFieldPresent";
import {
  createKanbanCanonInputSchema,
  editKanbanCanonInputSchema,
  updateKanbanCardPositionsInputSchema,
} from "./yupSchemas/kanbanCanon";

export default class KanbanCanonResolverValidator {
  constructor(private kanbanCanonDao: KanbanCanonDao, private kanbanCanonCardDao: KanbanCanonCardDao) {}

  async addOne(
    { input }: MutationCreateKanbanCanonArgs,
    context: ServerContext,
  ): Promise<MutationCreateKanbanCanonArgs> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to create new kanban canons!");
    }
    validateAgainstSchema<KanbanCanonDaoAddOneInput>(createKanbanCanonInputSchema, input);
    return { input };
  }

  async editOne(
    { id, input }: MutationEditKanbanCanonArgs,
    context: ServerContext,
  ): Promise<MutationEditKanbanCanonArgs> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to edit kanban canons!");
    }

    validateAtLeastOneFieldPresent(input);

    // Check if kanban canon id exists in db
    await this.kanbanCanonDao.getOne({ id }).then((kanbanCanon) => ensureExists("Kanban Canon")(kanbanCanon));

    validateAgainstSchema<KanbanCanonDaoEditOneInput>(editKanbanCanonInputSchema, input);
    return { id, input };
  }

  async updateCardPositions(
    { id, input }: MutationUpdateKanbanCanonCardPositionsArgs,
    context: ServerContext,
  ): Promise<MutationUpdateKanbanCanonCardPositionsArgs> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to edit kanban canons!");
    }

    validateAgainstSchema<KanbanCanonDaoUpdateCardPositionsInput>(updateKanbanCardPositionsInputSchema, input);

    // Check if kanban canon id exists in db
    await this.kanbanCanonDao.getOne({ id }).then((kanbanCanon) => ensureExists("Kanban Canon")(kanbanCanon));
    await this.kanbanCanonCardDao
      .getOne({ id: input.cardId })
      .then((kanbanCanonCard) => ensureExists("Kanban Canon Card")(kanbanCanonCard));

    return { id, input };
  }
}
