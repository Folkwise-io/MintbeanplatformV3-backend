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
import { prefixKeys } from "../util/prefixKeys";

export default class KanbanSessionDaoKnex implements KanbanSessionDao {
  constructor(private knex: Knex) {}

  // TODO: figure out how to make get kanban sessions queries DRY (resuse query)
  async getOne(args: KanbanSessionServiceGetOneArgs): Promise<KanbanSession> {
    return handleDatabaseError(async () => {
      // Create a logical entity of KanbanSessionCard via join on kanbanCards
      const kanbanSession = await this.knex
        .from("kanbanSessions")
        .innerJoin("kanbans", "kanbanSessions.kanbanId", "kanbans.id")
        .innerJoin("users", "kanbanSessions.userId", "users.id")
        .leftJoin("meets", "kanbanSessions.meetId", "meets.id")
        .select(
          { id: "kanbanSessions.id" },
          { title: "kanbans.title" },
          { description: "kanbans.description" },
          { createdAt: "kanbanSessions.createdAt" },
          { updatedAt: "kanbanSessions.updatedAt" },
        )
        .where(prefixKeys("kanbanSessions", { ...args, deleted: false }))
        .first();
      return kanbanSession;
    });
  }

  async getMany(args: KanbanSessionServiceGetManyArgs): Promise<KanbanSession[]> {
    return handleDatabaseError(async () => {
      // Create a logical entity of KanbanSessionCard via join on kanbanCards
      const kanbanSessions: KanbanSession[] = await this.knex
        .from("kanbanSessions")
        .innerJoin("kanbans", "kanbanSessions.kanbanId", "kanbans.id")
        .innerJoin("users", "kanbanSessions.userId", "users.id")
        .leftJoin("meets", "kanbanSessions.meetId", "meets.id")
        .select(
          { id: "kanbanSessions.id" },
          { title: "kanbans.title" },
          { description: "kanbans.description" },
          { createdAt: "kanbanSessions.createdAt" },
          { updatedAt: "kanbanSessions.updatedAt" },
        )
        .where(prefixKeys("kanbanSessions", { ...args, deleted: false }));
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
