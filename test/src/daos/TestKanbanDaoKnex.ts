import Knex from "knex";
import KanbanDaoKnex from "../../../src/dao/KanbanDaoKnex";

export interface KanbanSessionRaw {
  id: string;
  userId: string;
  kanbanCanonId: string;
  meetId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default class TestKanbanDaoKnex extends KanbanDaoKnex {
  constructor(knex: Knex) {
    super(knex);
  }

  async addMany(kanbans: KanbanSessionRaw[]): Promise<void> {
    return this.knex("kanbanSessions").insert(kanbans);
  }

  async deleteAll(): Promise<void> {
    return this.knex("kanbanSessions").delete();
  }
}
