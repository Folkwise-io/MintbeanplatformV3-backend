import Knex from "knex";
import { MeetServiceGetManyArgs } from "../service/MeetService";
import { Meet } from "../types/gqlGeneratedTypes";
import MeetDao from "./MeetDao";

export default class MeetDaoKnex implements MeetDao {
  constructor(private knex: Knex) {}

  async getMany(args: MeetServiceGetManyArgs): Promise<Meet[]> {
    return this.knex<Meet>("meets")
      .where({ ...args })
      .orderBy("startTime", "desc");
  }

  // Testing methods below, for TestManager to call
  async addMany(meets: Meet[]): Promise<void> {
    return this.knex<Meet>("meets").insert(meets);
  }

  deleteAll(): Promise<void> {
    return this.knex<Meet>("meets").delete();
  }
}
