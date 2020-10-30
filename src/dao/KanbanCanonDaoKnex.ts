import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCanonDao from "./KanbanCanonDao";
import { KanbanCanon } from "../types/gqlGeneratedTypes";
import { KanbanCanonServiceAddOneInput, KanbanCanonServiceGetOneArgs } from "../service/KanbanCanonService";

export default class KanbanCanonDaoKnex implements KanbanCanonDao {
  constructor(private knex: Knex) {}
  async getOne(args: KanbanCanonServiceGetOneArgs): Promise<KanbanCanon> {
    return handleDatabaseError(() => {
      return this.knex("kanbanCanons")
        .where({ ...args, deleted: false })
        .first();
    });
  }

  async getMany(): Promise<KanbanCanon[]> {
    return handleDatabaseError(() => {
      return this.knex.select("*").from("kanbanCanons").where({ deleted: false });
    });
  }

  async addOne(args: KanbanCanonServiceAddOneInput): Promise<KanbanCanon> {
    return handleDatabaseError(async () => {
      const insertedKanbanCanons = (await this.knex<KanbanCanon>("kanbanCanons")
        .insert(args)
        .returning("*")) as KanbanCanon[];
      return insertedKanbanCanons[0];
    });
  }

  // Testing methods below, for TestManager to call
  async addMany(kanbanCanons: KanbanCanon[]): Promise<void> {
    return this.knex<KanbanCanon>("kanbanCanons").insert(kanbanCanons);
  }

  async deleteAll(): Promise<void> {
    return this.knex<KanbanCanon>("kanbanCanons").delete();
  }
}
