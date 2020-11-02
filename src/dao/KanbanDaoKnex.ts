import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanDao, { KanbanSessionRaw } from "./KanbanDao";
import { Kanban } from "../types/gqlGeneratedTypes";
import { KanbanServiceGetOneArgs, KanbanServiceGetManyArgs, KanbanServiceAddOneInput } from "../service/KanbanService";
import { prefixKeys } from "../util/prefixKeys";

// type KanbanQueryTypes = KanbanServiceGetOneArgs | KanbanServiceGetManyArgs;
// const queryKanban = async (knex: Knex, args: KanbanQueryTypes) => {
//   return (
//     knex
//       .from("kanbanSessions")
//       .innerJoin("kanbanCanons", "kanbanSessions.kanbanCanonId", "kanbanCanons.id")
//       .select(
//         { id: "kanbanSessions.id" },
//         { kanbanCanonId: "kanbanSessions.kanbanCanonId" },
//         { userId: "kanbanSessions.userId" },
//         { meetId: "meets.id" },
//         { title: "kanbanCanons.title" },
//         { description: "kanbanCanons.description" },
//         { createdAt: "kanbanSessions.createdAt" },
//         { updatedAt: "kanbanSessions.updatedAt" },
//       )
//       .where(prefixKeys("kanbanSessions", { ...args, deleted: false }))
//   );
// };

// TODO: Refactor repeated query
export default class KanbanDaoKnex implements KanbanDao {
  constructor(private knex: Knex) {}
  async getOne(args: KanbanServiceGetOneArgs): Promise<Kanban> {
    return handleDatabaseError(async () => {
      const kanban = await this.knex
        .from("kanbanSessions")
        .innerJoin("kanbanCanons", "kanbanSessions.kanbanCanonId", "kanbanCanons.id")
        // .innerJoin("users", "kanbanSessions.userId", "users.id")
        // .leftJoin("meets", "kanbanSessions.meetId", "meets.id")
        .select(
          { id: "kanbanSessions.id" },
          { kanbanCanonId: "kanbanSessions.kanbanCanonId" },
          { userId: "kanbanSessions.userId" },
          { meetId: "kanbanSessions.meetId" },
          { title: "kanbanCanons.title" },
          { description: "kanbanCanons.description" },
          { createdAt: "kanbanSessions.createdAt" },
          { updatedAt: "kanbanSessions.updatedAt" },
        )
        .where(prefixKeys("kanbanSessions", { ...args, deleted: false }))
        .first();
      return kanban;
    });
  }

  async getMany(args: KanbanServiceGetManyArgs): Promise<Kanban[]> {
    return handleDatabaseError(async () => {
      const kanbans = await this.knex
        .from("kanbanSessions")
        .innerJoin("kanbanCanons", "kanbanSessions.kanbanCanonId", "kanbanCanons.id")
        // .innerJoin("users", "kanbanSessions.userId", "users.id")
        // .leftJoin("meets", "kanbanSessions.meetId", "meets.id")
        .select(
          { id: "kanbanSessions.id" },
          { kanbanCanonId: "kanbanSessions.kanbanCanonId" },
          { userId: "kanbanSessions.userId" },
          { meetId: "kanbanSessions.meetId" },
          { title: "kanbanCanons.title" },
          { description: "kanbanCanons.description" },
          { createdAt: "kanbanSessions.createdAt" },
          { updatedAt: "kanbanSessions.updatedAt" },
        )
        .where(prefixKeys("kanbanSessions", { ...args, deleted: false }));
      return kanbans;
    });
  }

  async addOne(args: KanbanServiceAddOneInput): Promise<Kanban> {
    return handleDatabaseError(async () => {
      const insertedKanbans = (await this.knex("kanbanSessions").insert(args).returning("*")) as KanbanSessionRaw[];
      const newKanban = insertedKanbans[0];
      // Re-fetch from db by id to get composed kanban
      return await this.getOne({ id: newKanban.id }).then((kb) => kb);
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("kanbanSessions").where({ id }).update({ deleted: true });
      return true;
    });
  }

  // Testing methods below, for TestManager to call
  async addMany(kanbans: KanbanSessionRaw[]): Promise<void> {
    return this.knex("kanbanSessions").insert(kanbans);
  }

  async deleteAll(): Promise<void> {
    return this.knex("kanbanSessions").delete();
  }
}
