import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCardDao, { KanbanSessionCardRaw } from "./KanbanCardDao";
import { KanbanCanonCardStatusEnum, KanbanCard } from "../types/gqlGeneratedTypes";
import { KanbanCardServiceGetManyArgs, KanbanCardServiceUpdateOneInput } from "../service/KanbanCardService";

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

interface KanbanCanonDaoGetOneArgs {
  id: string;
  kanbanId: string;
}

export default class KanbanCardDaoKnex implements KanbanCardDao {
  constructor(private knex: Knex) {}

  async getMany(args: KanbanCardServiceGetManyArgs): Promise<KanbanCard[]> {
    return handleDatabaseError(async () => {
      const { kanbanId } = args;
      const queryResult = await this.knex.raw(GET_MANY_QUERY, { kanbanSessionId: kanbanId, deleted: false });

      return queryResult.rows;
    });
  }

  async _getOne(args: KanbanCanonDaoGetOneArgs): Promise<KanbanCard> {
    return handleDatabaseError(async () => {
      const { kanbanId, id } = args;
      const queryResult = await this.knex.raw(GET_ONE_QUERY, {
        kanbanSessionId: kanbanId,
        kanbanCanonCardId: id,
        deleted: false,
      });

      return queryResult.rows;
    });
  }

  async updateOne(input: KanbanCardServiceUpdateOneInput): Promise<KanbanCard> {
    return handleDatabaseError(async () => {
      const { kanbanId, id, status } = input;
      console.log({ status });
      // Upsert kanban session card when update requested
      await this.knex.raw(
        `
        INSERT INTO "kanbanSessionCards" ("kanbanSessionId", "kanbanCanonCardId", "status")
        VALUES (:kanbanSessionId, :kanbanCanonCardId, :status)
        ON CONFLICT ("kanbanSessionId", "kanbanCanonCardId") DO UPDATE
        SET "status" = :status`,
        { kanbanSessionId: kanbanId, kanbanCanonCardId: id, status },
      );
      // refetch from db to get composed card
      return this._getOne({ id, kanbanId }).then((kbc) => kbc);
    });
  }

  async addMany(kanbanCards: KanbanSessionCardRaw[]): Promise<void> {
    return this.knex<KanbanSessionCardRaw>("kanbanSessionCards").insert(kanbanCards);
  }

  async deleteAll(): Promise<void> {
    return this.knex<KanbanSessionCardRaw>("kanbanSessionCards").delete();
  }
}
