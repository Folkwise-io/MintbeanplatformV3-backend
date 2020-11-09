import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCanonDao, { KanbanCanonRaw } from "./KanbanCanonDao";
import { KanbanCanon, KanbanCardPositions } from "../types/gqlGeneratedTypes";
import {
  KanbanCanonServiceAddOneInput,
  KanbanCanonServiceEditOneInput,
  KanbanCanonServiceGetOneArgs,
  KanbanCanonServiceUpdateCardPositionsInput,
} from "../service/KanbanCanonService";
import { updateCardPositions } from "./util/cardPositionUtils";

interface KanbanCanonDbFormat {
  id?: string;
  title: string;
  description: string;
  cardPositions: string;
  createdAt?: string;
  updatedAt?: string;
}

const toDbFormat = <T extends KanbanCanonRaw>(kanbanCanonInput: T): KanbanCanonDbFormat => {
  return {
    ...kanbanCanonInput,
    cardPositions: JSON.stringify(kanbanCanonInput.cardPositions),
  };
};

export default class KanbanCanonDaoKnex implements KanbanCanonDao {
  constructor(private knex: Knex) {}
  async getOne(args: KanbanCanonServiceGetOneArgs): Promise<KanbanCanon> {
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
        .where({ ...args, deleted: false })
        .first();

      return kanbanCanon;
    });
  }

  async getMany(): Promise<KanbanCanon[]> {
    return handleDatabaseError(() => {
      return this.knex.select("*").from("kanbanCanons").where({ deleted: false });
    });
  }

  async addOne(args: KanbanCanonServiceAddOneInput): Promise<{ id: string }> {
    return handleDatabaseError(async () => {
      const newKanbanCanons = await this.knex<KanbanCanon>("kanbanCanons").insert(args).returning("id");
      return newKanbanCanons[0].id;
    });
  }

  async editOne(id: string, input: KanbanCanonServiceEditOneInput): Promise<KanbanCanon> {
    return handleDatabaseError(async () => {
      const updatedKanbanCanons = (await this.knex("kanbanCanons")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as KanbanCanon[];
      return updatedKanbanCanons[0];
    });
  }

  async updateCardPositions(
    id: string,
    input: KanbanCanonServiceUpdateCardPositionsInput,
  ): Promise<KanbanCardPositions> {
    return handleDatabaseError(async () => {
      // get old positions
      const { cardPositions: oldPositions } = await this.knex
        .select("cardPositions")
        .from("kanbanCanons")
        .where({ id })
        .first();
      console.log({ oldPositions: oldPositions.todo });

      // calculate new positions
      const newPositions = updateCardPositions({ oldPositions, ...input });
      console.log({ newPositions });

      // update cardPositions in db
      await this.knex("kanbanCanons")
        .where({ id })
        .update({ cardPositions: newPositions, updatedAt: this.knex.fn.now() });

      return newPositions;
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("kanbanCanons").where({ id }).update({ deleted: true });
      return true;
    });
  }

  // Testing methods below, for TestManager to call
  async addMany(kanbanCanons: KanbanCanonRaw[]): Promise<void> {
    const kcWithStringifiedCardPositions = kanbanCanons.map((kc) => toDbFormat(kc));
    this.knex<KanbanCanonDbFormat[]>("kanbanCanons").insert(kcWithStringifiedCardPositions);
  }

  async deleteAll(): Promise<void> {
    return this.knex("kanbanCanons").delete();
  }
}
