import Knex from "knex";
import KanbanCanonCardDaoKnex from "../../../src/dao/KanbanCanonCardDaoKnex";
import { KanbanCanonCard } from "../../../src/types/gqlGeneratedTypes";

export default class TestKanbanCanonCardDaoKnex extends KanbanCanonCardDaoKnex {
  constructor(knex: Knex) {
    super(knex);
  }

  async addMany(kanbanCanonCards: KanbanCanonCard[]): Promise<void> {
    return this.knex<KanbanCanonCard>("kanbanCanonCards").insert(kanbanCanonCards);
  }

  async deleteAll(): Promise<void> {
    return this.knex<KanbanCanonCard>("kanbanCanonCards").delete();
  }
}
