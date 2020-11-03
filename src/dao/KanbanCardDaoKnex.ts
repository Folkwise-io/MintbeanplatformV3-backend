import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCardDao, { KanbanSessionCardRaw } from "./KanbanCardDao";
import { KanbanCanonCardStatusEnum, KanbanCard } from "../types/gqlGeneratedTypes";
import {
  KanbanCardServiceGetManyArgs,
  KanbanCardServiceGetOneArgs,
  KanbanCardServiceUpdateOneInput,
} from "../service/KanbanCardService";
import { KanbanCanonServiceGetOneArgs } from "../service/KanbanCanonService";

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

const GET_ONE_QUERY = GET_MANY_QUERY + ` AND "kanbanCanonCards"."id" = :kanbanCanonCardId LIMIT 1`;

export default class KanbanCardDaoKnex implements KanbanCardDao {
  constructor(private knex: Knex) {}

  async getMany(args: KanbanCardServiceGetManyArgs): Promise<KanbanCard[]> {
    return handleDatabaseError(async () => {
      const { kanbanId } = args;
      const queryResult = await this.knex.raw(GET_MANY_QUERY, { kanbanSessionId: kanbanId, deleted: false });

      return queryResult.rows;
    });
  }

  async getOne(args: KanbanCardServiceGetOneArgs): Promise<KanbanCard> {
    return handleDatabaseError(async () => {
      const { kanbanId, id } = args;
      const queryResult = await this.knex.raw(GET_ONE_QUERY, {
        kanbanSessionId: kanbanId,
        kanbanCanonCardId: id,
        deleted: false,
      });

      console.log(queryResult.rows);

      return queryResult.rows;
    });
  }

  async upsertOne(input: KanbanCardServiceUpdateOneInput): Promise<void> {
    return handleDatabaseError(async () => {
      const { kanbanId, id, status } = input;
      await this.knex.raw(
        `
        INSERT INTO "kanbanSessionCards" ("kanbanSessionId", "kanbanCanonCardId", "status")
        VALUES (:kanbanSessionId, :kanbanCanonCardId, :status)
        ON CONFLICT ("kanbanSessionId", "kanbanCanonCardId") DO UPDATE
        SET "status" = :status`,
        { kanbanSessionId: kanbanId, kanbanCanonCardId: id, status },
      );
    });
  }

  async addMany(kanbanCards: KanbanSessionCardRaw[]): Promise<void> {
    return this.knex<KanbanSessionCardRaw>("kanbanSessionCards").insert(kanbanCards);
  }

  async deleteAll(): Promise<void> {
    return this.knex<KanbanSessionCardRaw>("kanbanSessionCards").delete();
  }
}
