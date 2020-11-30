import Knex from "knex";
import BadgeDaoKnex from "../../../src/dao/BadgeDaoKnex";
import { Badge } from "../../../src/types/gqlGeneratedTypes";

export default class TestKanbanDaoKnex extends BadgeDaoKnex {
  constructor(knex: Knex) {
    super(knex);
  }

  async addMany(badges: Badge[]): Promise<void> {
    return this.knex("badges").insert(badges);
  }

  async deleteAll(): Promise<void> {
    return this.knex("badges").delete();
  }
}
