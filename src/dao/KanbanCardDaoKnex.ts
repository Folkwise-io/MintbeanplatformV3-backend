import Knex from "knex";
import {
  KanbanCardServiceAddOneInput,
  KanbanCardServiceEditOneInput,
  KanbanCardServiceGetOneArgs,
  KanbanCardServiceGetManyArgs,
} from "../service/KanbanCardService";
import { KanbanCard } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCardDao from "./KanbanCardDao";

export default class KanbanCardDaoKnex implements KanbanCardDao {
  constructor(private knex: Knex) {}

  async getOne(args: KanbanCardServiceGetOneArgs): Promise<KanbanCard> {
    return handleDatabaseError(async () => {
      const kanban = await this.knex("kanbanCards")
        .where({ ...args, deleted: false })
        .first();
      return kanban;
    });
  }

  async getMany(args: KanbanCardServiceGetManyArgs): Promise<KanbanCard[]> {
    return handleDatabaseError(async () => {
      const kanbanCards: KanbanCard[] = await this.knex("kanbanCards")
        .where({ ...args, deleted: false })
        .orderBy("index", "asc");
      return kanbanCards;
    });
  }

  async addOne(args: KanbanCardServiceAddOneInput): Promise<KanbanCard> {
    return handleDatabaseError(async () => {
      const newKanbanCards = (await this.knex("kanbanCards").insert(args).returning("*")) as KanbanCard[];
      return newKanbanCards[0];
    });
  }

  async editOne(id: string, input: KanbanCardServiceEditOneInput): Promise<KanbanCard> {
    return handleDatabaseError(async () => {
      const newKanbanCards = (await this.knex("kanbanCards")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as KanbanCard[];
      return newKanbanCards[0];
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("kanbanCards").where({ id }).update({ deleted: true });
      return true;
    });
  }

  // Testing methods below, for TestManager to call
  async addMany(kanbanCards: KanbanCard[]): Promise<void> {
    return this.knex<KanbanCard>("kanbanCards").insert(kanbanCards);
  }

  deleteAll(): Promise<void> {
    return this.knex<KanbanCard>("kanbanCards").delete();
  }
}
