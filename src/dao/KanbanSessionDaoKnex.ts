import Knex from "knex";
import {
  KanbanSessionServiceAddOneInput,
  KanbanSessionServiceEditOneInput,
  KanbanSessionServiceGetOneArgs,
  KanbanSessionServiceGetManyArgs,
} from "../service/KanbanSessionService";
import { KanbanSession } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanSessionDao from "./KanbanSessionDao";

export default class KanbanSessionDaoKnex implements KanbanSessionDao {
  constructor(private knex: Knex) {}

  async getOne(args: KanbanSessionServiceGetOneArgs): Promise<KanbanSession> {
    return handleDatabaseError(async () => {
      const kanbanSession = await this.knex("kanbanSessions")
        .where({ ...args, deleted: false })
        .first();
      return kanbanSession;
    });
  }

  async getMany(args: KanbanSessionServiceGetManyArgs): Promise<KanbanSession[]> {
    return handleDatabaseError(async () => {
      const kanbanSessions: KanbanSession[] = await this.knex("kanbanSessions").where({ ...args, deleted: false });
      return kanbanSessions;
    });
  }

  async addOne(args: KanbanSessionServiceAddOneInput): Promise<KanbanSession> {
    return handleDatabaseError(async () => {
      const newKanbanSessions = (await this.knex("kanbanSessions").insert(args).returning("*")) as KanbanSession[];
      return newKanbanSessions[0];
    });
  }

  async editOne(id: string, input: KanbanSessionServiceEditOneInput): Promise<KanbanSession> {
    return handleDatabaseError(async () => {
      const newKanbanSessions = (await this.knex("kanbanSessions")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as KanbanSession[];
      return newKanbanSessions[0];
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("kanbanSessions").where({ id }).update({ deleted: true });
      return true;
    });
  }

  // Testing methods below, for TestManager to call
  async addMany(kanbanSessions: KanbanSession[]): Promise<void> {
    return this.knex<KanbanSession>("kanbanSessions").insert(kanbanSessions);
  }

  deleteAll(): Promise<void> {
    return this.knex<KanbanSession>("kanbanSessions").delete();
  }
}
