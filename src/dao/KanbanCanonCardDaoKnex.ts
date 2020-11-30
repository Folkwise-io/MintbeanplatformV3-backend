import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCanonCardDao from "./KanbanCanonCardDao";
import { KanbanCanonCard } from "../types/gqlGeneratedTypes";
import {
  KanbanCanonCardDaoGetOneArgs,
  KanbanCanonCardDaoGetManyArgs,
  KanbanCanonCardDaoAddOneInput,
  KanbanCanonCardDaoEditOneInput,
} from "./KanbanCanonCardDao";
import { ensureExists } from "../util/ensureExists";

export default class KanbanCanonCardDaoKnex implements KanbanCanonCardDao {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }
  async getOne(args: KanbanCanonCardDaoGetOneArgs): Promise<KanbanCanonCard> {
    return handleDatabaseError(async () => {
      const kanbanCanonCard = await this.knex("kanbanCanonCards")
        .where({ ...args, deleted: false })
        .first();
      ensureExists<KanbanCanonCard>("Kanban Canon Card")(kanbanCanonCard);
      return kanbanCanonCard;
    });
  }

  async getMany(args: KanbanCanonCardDaoGetManyArgs): Promise<KanbanCanonCard[]> {
    return handleDatabaseError(() => {
      return this.knex
        .select("*")
        .from("kanbanCanonCards")
        .where({ ...args, deleted: false });
    });
  }

  async addOne(input: KanbanCanonCardDaoAddOneInput): Promise<KanbanCanonCard> {
    return handleDatabaseError(async () => {
      const insertedKanbanCanonCards = (await this.knex("kanbanCanonCards")
        .insert(input)
        .returning("*")) as KanbanCanonCard[];
      return insertedKanbanCanonCards[0];
    });
  }

  async editOne(id: string, input: KanbanCanonCardDaoEditOneInput): Promise<KanbanCanonCard> {
    return handleDatabaseError(async () => {
      const updatedKanbanCanonCards = (await this.knex("kanbanCanonCards")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as KanbanCanonCard[];
      return updatedKanbanCanonCards[0];
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("kanbanCanonCards").where({ id }).update({ deleted: true });
      return true;
    });
  }
}
