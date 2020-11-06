import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanDao, { KanbanSessionRaw } from "./KanbanDao";
import { Kanban, KanbanCardPositions } from "../types/gqlGeneratedTypes";
import { KanbanServiceGetOneArgs, KanbanServiceGetManyArgs, KanbanServiceAddOneInput } from "../service/KanbanService";
import { prefixKeys } from "../util/prefixKeys";
import { resolve } from "./util/cardStatusUtils";

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

interface KanbanRawData extends Kanban {
  kanbanCanonCardPositions: KanbanCardPositions;
  kanbanSessionCardPositions: KanbanCardPositions;
}

// omits kanbanCanonCardPositions and kanbanSessionCardPositions from KanbanRawData
const kanbanDataFilter = ({ id, kanbanCanonId, userId, meetId, title, description, createdAt, updatedAt }: Kanban) => ({
  id,
  kanbanCanonId,
  userId,
  meetId,
  title,
  description,
  createdAt,
  updatedAt,
});

const rawToKanban = (raw: KanbanRawData): Kanban => {
  // take the raw canon and session card status and resolve to the statuses the end user should see
  const { kanbanCanonCardPositions, kanbanSessionCardPositions } = raw;
  const cardPositions: KanbanCardPositions = resolve(kanbanCanonCardPositions, kanbanSessionCardPositions);
  // filter the raw kanban data and add the resolved cardPositions
  return { ...kanbanDataFilter(raw), cardPositions } as Kanban;
};

// TODO: Refactor repeated query
export default class KanbanDaoKnex implements KanbanDao {
  constructor(private knex: Knex) {}
  async getOne(args: KanbanServiceGetOneArgs): Promise<Kanban> {
    return handleDatabaseError(async () => {
      const kanbanRawData: KanbanRawData = await this.knex
        .from("kanbanSessions")
        .innerJoin("kanbanCanons", "kanbanSessions.kanbanCanonId", "kanbanCanons.id")
        .select(
          { id: "kanbanSessions.id" },
          { kanbanCanonId: "kanbanSessions.kanbanCanonId" },
          { userId: "kanbanSessions.userId" },
          { meetId: "kanbanSessions.meetId" },
          { title: "kanbanCanons.title" },
          { description: "kanbanCanons.description" },
          { createdAt: "kanbanSessions.createdAt" },
          { updatedAt: "kanbanSessions.updatedAt" },
          { kanbanSessionCardPositions: "kanbanSessions.cardPositions" },
          { kanbanCanonCardPositions: "kanbanCanons.cardPositions" },
        )
        .where(prefixKeys("kanbanSessions", { ...args, deleted: false }))
        .first();

      // resolve kanban card status positions the end user should see
      const kanban = rawToKanban(kanbanRawData);
      return kanban;
    });
  }

  async getMany(args: KanbanServiceGetManyArgs): Promise<Kanban[]> {
    return handleDatabaseError(async () => {
      const kanbanRawData: KanbanRawData[] = ((await this.knex
        .from("kanbanSessions")
        .innerJoin("kanbanCanons", "kanbanSessions.kanbanCanonId", "kanbanCanons.id")
        .select(
          { id: "kanbanSessions.id" },
          { kanbanCanonId: "kanbanSessions.kanbanCanonId" },
          { userId: "kanbanSessions.userId" },
          { meetId: "kanbanSessions.meetId" },
          { title: "kanbanCanons.title" },
          { description: "kanbanCanons.description" },
          { createdAt: "kanbanSessions.createdAt" },
          { updatedAt: "kanbanSessions.updatedAt" },
          { kanbanSessionCardPositions: "kanbanSessions.cardPositions" },
          { kanbanCanonCardPositions: "kanbanCanons.cardPositions" },
        )
        .where(prefixKeys("kanbanSessions", { ...args, deleted: false }))) as unknown) as KanbanRawData[];

      // resolve kanban card status positions the end user should see
      const kanbans = kanbanRawData.map((raw) => rawToKanban(raw));

      return kanbans;
    });
  }

  async addOne(args: KanbanServiceAddOneInput): Promise<void> {
    return handleDatabaseError(async () => {
      await this.knex("kanbanSessions").insert(args);
      // Note: to get this newly created kanban, re-fetch using this.getOne() with the same args
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
