import Knex from "knex";
import { KanbanServiceAddOneInput, KanbanServiceEditOneInput, KanbanServiceGetOneArgs } from "../service/KanbanService";
import { Kanban } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanDao from "./KanbanDao";

export default class KanbanDaoKnex implements KanbanDao {
  constructor(private knex: Knex) {}

  async getOne(args: KanbanServiceGetOneArgs): Promise<Kanban> {
    return handleDatabaseError(async () => {
      const kanban = await this.knex("kanbans")
        .where({ ...args, deleted: false })
        .first();
      return kanban;
    });
  }

  async getMany(): Promise<Kanban[]> {
    return handleDatabaseError(async () => {
      const kanbans: Kanban[] = await this.knex("kanbans").where({ deleted: false });
      return kanbans;
    });
  }

  async addOne(args: KanbanServiceAddOneInput): Promise<Kanban> {
    return handleDatabaseError(async () => {
      const newKanbans = (await this.knex("kanbans").insert(args).returning("*")) as Kanban[];
      return newKanbans[0];
    });
  }

  async editOne(id: string, input: KanbanServiceEditOneInput): Promise<Kanban> {
    return handleDatabaseError(async () => {
      const newKanbans = (await this.knex("kanbans")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as Kanban[];
      return newKanbans[0];
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("kanbans").where({ id }).update({ deleted: true });
      return true;
    });
  }

  // Testing methods below, for TestManager to call
  async addMany(kanbans: Kanban[]): Promise<void> {
    return this.knex<Kanban>("kanbans").insert(kanbans);
  }

  deleteAll(): Promise<void> {
    return this.knex<Kanban>("kanbans").delete();
  }
}
