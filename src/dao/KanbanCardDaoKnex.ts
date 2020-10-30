import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCardDao, { KanbanSessionCardRaw } from "./KanbanCardDao";
import { KanbanCard } from "../types/gqlGeneratedTypes";
import { KanbanCardServiceGetManyArgs } from "../service/KanbanCardService";

const GET_MANY_QUERY = `
  SELECT 
    "kanbanCanonCards"."id" as "id",
    "kanbanCanonCards"."title" as "title",
    "kanbanCanonCards"."body" as "body",
    COALESCE("kanbanSessionCards"."status", "kanbanCanonCards"."status") as "status",
    "kanbanSessions"."id" as "kanbanId"
  FROM "kanbanCanonCards" 
  JOIN "kanbanSessions" ON "kanbanCanonCards"."kanbanCanonId" = "kanbanSessions"."kanbanCanonId"
  LEFT JOIN (
      SELECT
          *
      FROM "kanbanSessionCards"
      WHERE "kanbanSessionCards"."deleted" = :deleted
      AND "kanbanSessionCards"."kanbanSessionId" = :kanbanSessionId
  ) AS "kanbanSessionCards"
    ON "kanbanSessionCards"."kanbanCanonCardId" = "kanbanCanonCards"."id"
  WHERE "kanbanSessions"."id" = :kanbanSessionId`;

export default class KanbanCardDaoKnex implements KanbanCardDao {
  constructor(private knex: Knex) {}

  async getMany(args: KanbanCardServiceGetManyArgs): Promise<KanbanCard[]> {
    return handleDatabaseError(async () => {
      const queryResult = await this.knex.raw(GET_MANY_QUERY, { kanbanSessionId: args.kanbanId, deleted: false });

      return queryResult.rows;
    });
  }

  async addMany(kanbanCards: KanbanSessionCardRaw[]): Promise<void> {
    return this.knex<KanbanSessionCardRaw>("kanbanSessionCards").insert(kanbanCards);
  }

  async deleteAll(): Promise<void> {
    return this.knex<KanbanSessionCardRaw>("kanbanSessionCards").delete();
  }
}

//   async addOne(args: KanbanCardServiceAddOneArgs): Promise<KanbanCard> {
//     return handleDatabaseError(async () => {
//       const insertedKanbanCards = (await this.knex<KanbanCard>("kanbanCards")
//         .insert(args)
//         .returning("*")) as KanbanCard[];
//       return insertedKanbanCards[0];
//     });
//   }
