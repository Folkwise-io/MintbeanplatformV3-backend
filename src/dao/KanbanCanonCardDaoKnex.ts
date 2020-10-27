import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCanonCardDao from "./KanbanCanonCardDao";
import { KanbanCanonCard } from "../types/gqlGeneratedTypes";
import { KanbanCanonCardServiceGetOneArgs, KanbanCanonCardServiceGetManyArgs } from "../service/KanbanCanonCardService";

export default class KanbanCanonCardDaoKnex implements KanbanCanonCardDao {
  constructor(private knex: Knex) {}
  async getOne(args: KanbanCanonCardServiceGetOneArgs): Promise<KanbanCanonCard> {
    return handleDatabaseError(() => {
      return this.knex("kanbanCanonCards")
        .where({ ...args, deleted: false })
        .first();
    });
  }

  async getMany(args: KanbanCanonCardServiceGetManyArgs): Promise<KanbanCanonCard[]> {
    return handleDatabaseError(() => {
      return this.knex
        .select("*")
        .from("kanbanCanonCards")
        .where({ ...args, deleted: false });
    });
  }

  //   async addOne(args: KanbanCanonCardServiceAddOneArgs): Promise<KanbanCanonCard> {
  //     return handleDatabaseError(async () => {
  //       const insertedKanbanCanonCards = (await this.knex<KanbanCanonCard>("kanbanCanonCards")
  //         .insert(args)
  //         .returning("*")) as KanbanCanonCard[];
  //       return insertedKanbanCanonCards[0];
  //     });
  //   }

  // Testing methods below, for TestManager to call
  async addMany(kanbanCanonCards: KanbanCanonCard[]): Promise<void> {
    return this.knex<KanbanCanonCard>("kanbanCanonCards").insert(kanbanCanonCards);
  }

  async deleteAll(): Promise<void> {
    return this.knex<KanbanCanonCard>("kanbanCanonCards").delete();
  }
}
