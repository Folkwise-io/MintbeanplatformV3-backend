import Knex from "knex";
import { Meet } from "../types/gqlGeneratedTypes";
import MeetDao from "./MeetDao";

export default class MeetDaoKnex implements MeetDao {
  constructor(private knex: Knex) {}

  // Testing methods below, for TestManager to call
  async addMany(meets: Meet[]): Promise<void> {
    return this.knex<Meet>("meets").insert(meets);
  }

  deleteAll(): Promise<void> {
    return this.knex<Meet>("meets").delete();
  }
}
