import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanCanonCardDao from "../dao/KanbanCanonCardDao";
import KanbanCanonDao from "../dao/KanbanCanonDao";
import { KanbanCanonCardServiceGetManyArgs, KanbanCanonCardServiceGetOneArgs } from "../service/KanbanCanonCardService";
import {
  KanbanCanon,
  KanbanCanonCard,
  MutationCreateKanbanCanonCardArgs,
  MutationEditKanbanCanonCardArgs,
  QueryKanbanCanonCardArgs,
  QueryKanbanCanonCardsArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { validateAtLeastOneFieldPresent } from "../util/validateAtLeastOneFieldPresent";

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

    return { id, input };
  }

  //   async deleteOne({ id }: MutationDeleteKanbanCanonCardArgs): Promise<string> {
  //     // Check if meet id exists in db
  //     return this.kanbanCanonCardDao
  //       .getOne({ id })
  //       .then((meet) => ensureExists<KanbanCanonCard>("KanbanCanonCard")(meet))
  //       .then(({ id }) => id);
  //   }
}
