import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanCanonDao, { KanbanCanonCardDaoDeleteCardFromPositionInput } from "./KanbanCanonDao";
import { KanbanCanon, KanbanCardPositions } from "../types/gqlGeneratedTypes";
import {
  KanbanCanonServiceAddOneInput,
  KanbanCanonServiceEditOneInput,
  KanbanCanonServiceGetOneArgs,
  KanbanCanonServiceUpdateCardPositionsInput,
} from "../service/KanbanCanonService";
import { deleteCardFromPosition, insertNewCardPosition, updateCardPositions } from "./util/cardPositionUtils";

// interface KanbanCanonDbFormat {
//   id?: string;
//   title: string;
//   description: string;
//   cardPositions?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// const toDbFormat = <T extends KanbanCanonRaw>(kanbanCanonInput: T): KanbanCanonDbFormat => {
//   if (kanbanCanonInput.cardPositions) {
//     return {
//       ...kanbanCanonInput,
//       cardPositions: JSON.stringify(kanbanCanonInput.cardPositions),
//     };
//   }
//   return kanbanCanonInput as KanbanCanonDbFormat;
// };

export default class KanbanCanonDaoKnex implements KanbanCanonDao {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }
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

  async addOne(args: KanbanCanonServiceAddOneInput): Promise<{ id: string }> {
    return handleDatabaseError(async () => {
      const newKanbanCanonIds = await this.knex<KanbanCanon>("kanbanCanons").insert(args).returning("id");
      return newKanbanCanonIds[0];
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

      // calculate new positions
      const newPositions = updateCardPositions({ oldPositions, ...input });

      // update cardPositions in db
      await this.knex("kanbanCanons")
        .where({ id })
        .update({ cardPositions: newPositions, updatedAt: this.knex.fn.now() });

      return newPositions;
    });
  }

  async insertNewCardPosition(
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

  // // Testing methods below, for TestManager to call
  // async addMany(kanbanCanons: KanbanCanonRaw[]): Promise<void> {
  //   const kcWithStringifiedCardPositions = kanbanCanons.map((kc) => toDbFormat(kc));
  //   return this.knex<KanbanCanonDbFormat[]>("kanbanCanons").insert(kcWithStringifiedCardPositions);
  // }

  // async deleteAll(): Promise<void> {
  //   return this.knex("kanbanCanons").delete();
  // }
}
