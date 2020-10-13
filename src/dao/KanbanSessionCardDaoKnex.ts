import Knex from "knex";
import {
  KanbanSessionCardServiceAddOneInput,
  KanbanSessionCardServiceEditOneInput,
  KanbanSessionCardServiceGetOneArgs,
  KanbanSessionCardServiceGetManyArgs,
} from "../service/KanbanSessionCardService";
import { KanbanSessionCard } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanSessionCardDao from "./KanbanSessionCardDao";

export default class KanbanSessionCardDaoKnex implements KanbanSessionCardDao {
  constructor(private knex: Knex) {}

  async getOne(args: KanbanSessionCardServiceGetOneArgs): Promise<KanbanSessionCard> {
    return handleDatabaseError(async () => {
      const kanbanSession = await this.knex("kanbanSessionCards")
        .where({ ...args, deleted: false })
        .first();
      return kanbanSession;
    });
  }

  async getMany(args: KanbanSessionCardServiceGetManyArgs): Promise<KanbanSessionCard[]> {
    return handleDatabaseError(async () => {
      const kanbanSessionCards: KanbanSessionCard[] = await this.knex("kanbanSessionCards")
        .where({ ...args, deleted: false })
        .orderBy("index", "asc");
      return kanbanSessionCards;
    });
  }

  async addOne(args: KanbanSessionCardServiceAddOneInput): Promise<KanbanSessionCard> {
    return handleDatabaseError(async () => {
      const newKanbanSessionCards = (await this.knex("kanbanSessionCards")
        .insert(args)
        .returning("*")) as KanbanSessionCard[];
      return newKanbanSessionCards[0];
    });
  }

  async editOne(id: string, input: KanbanSessionCardServiceEditOneInput): Promise<KanbanSessionCard> {
    return handleDatabaseError(async () => {
      const newKanbanSessionCards = (await this.knex("kanbanSessionCards")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as KanbanSessionCard[];
      return newKanbanSessionCards[0];
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("kanbanSessionCards").where({ id }).update({ deleted: true });
      return true;
    });
  }

  // Testing methods below, for TestManager to call
  async addMany(kanbanSessionCards: KanbanSessionCard[]): Promise<void> {
    return this.knex<KanbanSessionCard>("kanbanSessionCards").insert(kanbanSessionCards);
  }

  deleteAll(): Promise<void> {
    return this.knex<KanbanSessionCard>("kanbanSessionCards").delete();
  }
}
