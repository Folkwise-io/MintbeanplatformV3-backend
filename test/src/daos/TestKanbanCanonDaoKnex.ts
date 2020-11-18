import Knex from "knex";
import KanbanCanonDaoKnex from "../../../src/dao/KanbanCanonDaoKnex";
import { KanbanCardPositions } from "../../../src/types/gqlGeneratedTypes";

export interface KanbanCanonRaw {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  cardPositions?: KanbanCardPositions;
}

interface KanbanCanonDbFormat {
  id?: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  cardPositions?: string; // stringified cardPositions for db
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

export default class TestKanbanCanonDaoKnex extends KanbanCanonDaoKnex {
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
