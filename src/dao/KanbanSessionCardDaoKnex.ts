import Knex from "knex";
import {
  KanbanSessionCardServiceAddOneInput,
  KanbanSessionCardServiceEditOneInput,
  KanbanSessionCardServiceGetOneArgs,
  KanbanSessionCardServiceGetManyArgs,
} from "../service/KanbanSessionCardService";
import { KanbanSessionCard, KanbanCardStatusEnum } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import { prefixKeys } from "../util/prefixKeys";
import KanbanSessionCardDao from "./KanbanSessionCardDao";

// For test manager method
export interface KanbanSessionCardRaw {
  id: string;
  kanbanSessionId: string;
  kanbanCardId: string;
  status: KanbanCardStatusEnum;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
}

export default class KanbanSessionCardDaoKnex implements KanbanSessionCardDao {
  constructor(private knex: Knex) {}

  async getOne(args: KanbanSessionCardServiceGetOneArgs): Promise<KanbanSessionCard> {
    return handleDatabaseError(async () => {
      const kanbanSession = await this.knex
        .from("kanbanSessionCards")
        .innerJoin("kanbanCards", "kanbanSessionCards.kanbanCardId", "kanbanCards.id")
        .select(
          { id: "kanbanSessionCards.id" },
          { title: "kanbanCards.title" },
          { body: "kanbanCards.body" },
          { status: "kanbanSessionCards.status" },
          { createdAt: "kanbanSessionCards.createdAt" },
          { updatedAt: "kanbanSessionCards.updatedAt" },
          { kanbanSessionId: "kanbanSessionCards.kanbanSessionId" },
          { kanbanCardId: "kanbanSessionCards.kanbanCardId" },
        )
        .where(prefixKeys("kanbanSessionCards", { ...args, deleted: false }))
        .first();
      return kanbanSession;
    });
  }

  async getMany(args: KanbanSessionCardServiceGetManyArgs): Promise<KanbanSessionCard[]> {
    return handleDatabaseError(async () => {
      // Create kanban session cards mirrors of kanban cards for those that don't yet have
      const kanbanCardIdsWithoutKanbanSessionCards = await this.knex.raw(
        `SELECT "kanbanCards"."id" FROM "kanbanCards"
           LEFT JOIN "kanbanSessionCards" ON "kanbanSessionCards"."kanbanCardId" = "kanbanCards"."id"
           WHERE "kanbanSessionCards"."id" IS NULL`,
      );
      console.log({ kanbanCardIdsWithoutKanbanSessionCards });
      if (kanbanCardIdsWithoutKanbanSessionCards) {
        kanbanCardIdsWithoutKanbanSessionCards.forEach((kbc: { id: string }) => {
          this.addOne({ ...args, kanbanCardId: kbc.id, status: KanbanCardStatusEnum.Todo });
        });
      }
      const kanbanSessionCards: KanbanSessionCard[] = await this.knex
        .from("kanbanCards")
        // Do a left join here so that if a corresponding kanbanSessionCard does not yet exist (meaning the kanbanCard hasn't been moved yet by user) the value coalesces to the default value (kanbanCards.status)
        .leftJoin("kanbanSessionCards", "kanbanCards.id", "kanbanSessionCards.kanbanCardId")
        .select(
          { id: "kanbanSessionCards.id" },
          { title: "kanbanCards.title" },
          { body: "kanbanCards.body" },
          { status: this.knex.raw(`COALESCE("kanbanSessionCards"."status", "kanbanCards"."status")`) },
          { createdAt: "kanbanSessionCards.createdAt" },
          { updatedAt: "kanbanSessionCards.updatedAt" },
          { kanbanSessionId: "kanbanSessionCards.kanbanSessionId" },
          { kanbanCardId: "kanbanSessionCards.kanbanCardId" },
        )
        .where(prefixKeys("kanbanSessionCards", { ...args, deleted: false }));
      return kanbanSessionCards;
    });
  }

  async addOne(args: KanbanSessionCardServiceAddOneInput): Promise<KanbanSessionCard> {
    return handleDatabaseError(async () => {
      const newKanbanSessionCard = await this.knex("kanbanSessionCards")
        .insert(args)
        .returning("*")
        .then((kanbanSessionCards) => this.getOne({ id: kanbanSessionCards[0].id }));
      return newKanbanSessionCard;
    });
  }

  async editOne(id: string, input: KanbanSessionCardServiceEditOneInput): Promise<KanbanSessionCard> {
    return handleDatabaseError(async () => {
      const updatedKanbanSessionCard = await this.knex("kanbanSessionCards")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")
        .then((kanbanSessionCards) => this.getOne({ id: kanbanSessionCards[0].id }));
      return updatedKanbanSessionCard;
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("kanbanSessionCards").where({ id }).update({ deleted: true });
      return true;
    });
  }

  // Testing methods below, for TestManager to call
  async addMany(kanbanSessionCards: KanbanSessionCardRaw[]): Promise<void> {
    return this.knex<KanbanSessionCardRaw>("kanbanSessionCards").insert(kanbanSessionCards);
  }

  deleteAll(): Promise<void> {
    return this.knex<KanbanSessionCard>("kanbanSessionCards").delete();
  }
}
