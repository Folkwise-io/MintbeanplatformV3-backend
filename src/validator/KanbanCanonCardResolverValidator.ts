import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanCanonCardDao from "../dao/KanbanCanonCardDao";
import KanbanCanonDao from "../dao/KanbanCanonDao";
import {
  KanbanCanonCardServiceAddOneInput,
  KanbanCanonCardServiceEditOneInput,
} from "../service/KanbanCanonCardService";
import {
  KanbanCanon,
  KanbanCanonCard,
  MutationCreateKanbanCanonCardArgs,
  MutationDeleteKanbanCanonCardArgs,
  MutationEditKanbanCanonCardArgs,
  QueryKanbanCanonCardArgs,
  QueryKanbanCanonCardsArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { validateAtLeastOneFieldPresent } from "../util/validateAtLeastOneFieldPresent";
import { createKanbanCanonCardInputSchema, editKanbanCanonCardInputSchema } from "./yupSchemas/kanbanCanonCard";

export default class KanbanCanonCardResolverValidator {
  constructor(private kanbanCanonCardDao: KanbanCanonCardDao, private kanbanCanonDao: KanbanCanonDao) {}

  async getOne({ id }: QueryKanbanCanonCardArgs, _context: ServerContext): Promise<QueryKanbanCanonCardArgs> {
    await this.kanbanCanonCardDao
      .getOne({ id })
      .then((kanbanCanonCard) => ensureExists<KanbanCanonCard>("KanbanCanonCard")(kanbanCanonCard));
    return { id };
  }

  async getMany(
    { kanbanCanonId }: QueryKanbanCanonCardsArgs,
    _context: ServerContext,
  ): Promise<QueryKanbanCanonCardsArgs> {
    await this.kanbanCanonDao
      .getOne({ id: kanbanCanonId })
      .then((kanbanCanon) => ensureExists<KanbanCanon>("KanbanCanon")(kanbanCanon));
    return { kanbanCanonId };
  }

  async addOne(
    { input }: MutationCreateKanbanCanonCardArgs,
    context: ServerContext,
  ): Promise<MutationCreateKanbanCanonCardArgs> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to create kanban canon cards!");
    }
    validateAgainstSchema<KanbanCanonCardServiceAddOneInput>(createKanbanCanonCardInputSchema, input);

    return { input };
  }

  async editOne(
    { id, input }: MutationEditKanbanCanonCardArgs,
    context: ServerContext,
  ): Promise<MutationEditKanbanCanonCardArgs> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to edit kanban canon cards!");
    }

    // Check if kanbanCanonCard id exists in db
    await this.kanbanCanonCardDao
      .getOne({ id })
      .then((kanbanCanonCard) => ensureExists("Kanban Canon Card")(kanbanCanonCard));

    // Handle when input has no fields to update (knex doesn't like this)
    validateAtLeastOneFieldPresent(input);

    validateAgainstSchema<KanbanCanonCardServiceEditOneInput>(editKanbanCanonCardInputSchema, input);

    return { id, input };
  }

  async deleteOne(
    { id }: MutationDeleteKanbanCanonCardArgs,
    context: ServerContext,
  ): Promise<MutationDeleteKanbanCanonCardArgs> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to delete kanban canons!");
    }
    // Check if meet id exists in db
    await this.kanbanCanonCardDao.getOne({ id }).then((meet) => ensureExists<KanbanCanonCard>("KanbanCanonCard")(meet));
    return { id };
  }
}
