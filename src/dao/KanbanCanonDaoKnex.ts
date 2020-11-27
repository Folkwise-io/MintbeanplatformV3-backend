import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCanonDao, { KanbanCanonCardDaoDeleteCardFromPositionInput } from "./KanbanCanonDao";
import { KanbanCanon, KanbanCardPositions } from "../types/gqlGeneratedTypes";
import {
  KanbanCanonDaoAddOneInput,
  KanbanCanonDaoEditOneInput,
  KanbanCanonDaoGetOneArgs,
  KanbanCanonDaoUpdateCardPositionsInput,
} from "./KanbanCanonDao";
import { deleteCardFromPosition, insertNewCardPosition, updateCardPositions } from "./util/cardPositionUtils";

export default class KanbanCanonDaoKnex implements KanbanCanonDao {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }
  async getOne(args: KanbanCanonDaoGetOneArgs): Promise<KanbanCanon> {
    return handleDatabaseError(async () => {
      const kanbanCanon = await this.knex("kanbanCanons")
        .select(
          { id: "id" },
          { title: "title" },
          { description: "description" },
          { createdAt: "createdAt" },
          { updatedAt: "updatedAt" },
          { cardPositions: "cardPositions" },
        )
        .where(args)
        .first();

      return kanbanCanon;
    });
  }

  async getMany(): Promise<KanbanCanon[]> {
    return handleDatabaseError(() => {
      return this.knex.select("*").from("kanbanCanons");
    });
  }

  async addOne(args: KanbanCanonDaoAddOneInput): Promise<{ id: string }> {
    return handleDatabaseError(async () => {
      const newKanbanCanonIds = await this.knex<KanbanCanon>("kanbanCanons").insert(args).returning("id");
      return newKanbanCanonIds[0];
    });
  }

  async editOne(id: string, input: KanbanCanonDaoEditOneInput): Promise<KanbanCanon> {
    return handleDatabaseError(async () => {
      const updatedKanbanCanons = (await this.knex("kanbanCanons")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as KanbanCanon[];
      return updatedKanbanCanons[0];
    });
  }

  async updateCardPositions(id: string, input: KanbanCanonDaoUpdateCardPositionsInput): Promise<KanbanCardPositions> {
    return handleDatabaseError(async () => {
      // get old positions
      const { cardPositions: oldPositions } = await this.knex
        .select("cardPositions")
        .from("kanbanCanons")
        .where({ id })
        .first();

      // calculate new positions
      const newPositions = updateCardPositions({ oldPositions, ...input });

      // update cardPositions in db
      await this.knex("kanbanCanons")
        .where({ id })
        .update({ cardPositions: newPositions, updatedAt: this.knex.fn.now() });

      return newPositions;
    });
  }

  async insertNewCardPosition(id: string, input: KanbanCanonDaoUpdateCardPositionsInput): Promise<KanbanCardPositions> {
    return handleDatabaseError(async () => {
      // get old positions
      const { cardPositions: oldPositions } = await this.knex
        .select("cardPositions")
        .from("kanbanCanons")
        .where({ id })
        .first();

      // calculate new positions
      const newPositions = insertNewCardPosition({ oldPositions, ...input });

      // update cardPositions in db
      await this.knex("kanbanCanons")
        .where({ id })
        .update({ cardPositions: newPositions, updatedAt: this.knex.fn.now() });

      return newPositions;
    });
  }

  async deleteCardFromPosition(
    id: string,
    input: KanbanCanonCardDaoDeleteCardFromPositionInput,
  ): Promise<KanbanCardPositions> {
    return handleDatabaseError(async () => {
      // get old positions
      const { cardPositions: oldPositions } = await this.knex
        .select("cardPositions")
        .from("kanbanCanons")
        .where({ id })
        .first();

      // calculate new positions
      const newPositions = deleteCardFromPosition({ oldPositions, cardId: input.kanbanCanonCardId });

      // update cardPositions in db
      await this.knex("kanbanCanons")
        .where({ id })
        .update({ cardPositions: newPositions, updatedAt: this.knex.fn.now() });

      return newPositions;
    });
  }
}
