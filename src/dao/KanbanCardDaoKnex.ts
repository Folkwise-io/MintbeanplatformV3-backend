import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCardDao, { KanbanSessionCardRaw } from "./KanbanCardDao";
import { KanbanCard } from "../types/gqlGeneratedTypes";
import { KanbanCardServiceGetManyArgs } from "../service/KanbanCardService";

export default class KanbanCardDaoKnex implements KanbanCardDao {
  constructor(private knex: Knex) {}

  async getMany(args: KanbanCardServiceGetManyArgs): Promise<KanbanCard[]> {
    return handleDatabaseError(() => {
      return this.knex("kanbanCanonCards")
        .select(
          this.knex.raw(`
               ksc."id" as "id",
               "kanbanCanonCards"."title" as "title",
               "kanbanCanonCards"."body" as "body",
               COALESCE(ksc."status", "kanbanCanonCards"."status") as "status",
               ksc."createdAt" as "createdAt",
               ksc."updatedAt" as "updatedAt",
               ksc."kanbanSessionId" as "kanbanId",
               ksc."kanbanCanonCardId" as "kanbanCanonCardId"
               `),
        )
        .leftJoin(
          this.knex.raw(`(
               select
                 *
               from "kanbanSessionCards"
            ) as ksc
            on ksc."kanbanCanonCardId" = "kanbanCanonCards"."id"`),
        )
        .where({ "ksc.kanbanSessionId": args.kanbanId, "ksc.deleted": false });
    });
  }
  async addMany(kanbanCards: KanbanSessionCardRaw[]): Promise<void> {
    return this.knex<KanbanSessionCardRaw>("kanbanSessionCards").insert(kanbanCards);
  }

  async deleteAll(): Promise<void> {
    return this.knex<KanbanCard>("kanbanSessionCards").delete();
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
