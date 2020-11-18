import Knex from "knex";
import KanbanCanonDaoKnex from "../../../src/dao/KanbanCanonDaoKnex";
import TestKanbanCanonDao, { KanbanCanonRaw } from "./TestKanbanCanonDao";
// Testing methods below, for TestManager to call

interface KanbanCanonDbFormat {
  id?: string;
  title: string;
  description: string;
  cardPositions?: string;
  createdAt?: string;
  updatedAt?: string;
}

const toDbFormat = <T extends KanbanCanonRaw>(kanbanCanonInput: T): KanbanCanonDbFormat => {
  if (kanbanCanonInput.cardPositions) {
    return {
      ...kanbanCanonInput,
      cardPositions: JSON.stringify(kanbanCanonInput.cardPositions),
    };
  }
  return kanbanCanonInput as KanbanCanonDbFormat;
};

export default class TestKanbanCanonDaoKnex extends KanbanCanonDaoKnex implements TestKanbanCanonDao {
  constructor(knex: Knex) {
    super(knex);
  }
  async addMany(kanbanCanons: KanbanCanonRaw[]): Promise<void> {
    const kcWithStringifiedCardPositions = kanbanCanons.map((kc) => toDbFormat(kc));
    return this.knex<KanbanCanonDbFormat[]>("kanbanCanons").insert(kcWithStringifiedCardPositions);
  }

  async deleteAll(): Promise<void> {
    return this.knex("kanbanCanons").delete();
  }
}
