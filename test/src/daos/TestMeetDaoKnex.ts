import Knex from "knex";
import MeetDaoKnex from "../../../src/dao/MeetDaoKnex";
import { Meet } from "../../../src/types/gqlGeneratedTypes";

export default class TestMeetDaoKnex extends MeetDaoKnex {
  constructor(knex: Knex) {
    super(knex);
  }

  async addMany(meets: Meet[]): Promise<void> {
    return this.knex<Meet>("meets").insert(meets);
  }

  deleteAll(): Promise<void> {
    return this.knex<Meet>("meets").delete();
  }
}
