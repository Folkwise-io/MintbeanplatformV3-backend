import Knex from "knex";
import { MeetServiceGetManyArgs } from "../service/MeetService";
import { Meet } from "../types/gqlGeneratedTypes";
import MeetDao from "./MeetDao";

export default class MeetDaoKnex implements MeetDao {
  constructor(private knex: Knex) {}

  async getMany(args: MeetServiceGetManyArgs): Promise<Meet[]> {
    const meets = await this.knex("meets")
      .where({ ...args, deleted: false })
      .orderBy("startTime", "desc");

    // Remove the Z from startTime and endTime
    const newMeets = meets.map((meet) => ({
      ...meet,
      startTime: meet.startTime.toISOString().slice(0, -1),
      endTime: meet.endTime.toISOString().slice(0, -1),
    }));

    return newMeets;
  }

  // Testing methods below, for TestManager to call
  async addMany(meets: Meet[]): Promise<void> {
    return this.knex<Meet>("meets").insert(meets);
  }

  deleteAll(): Promise<void> {
    return this.knex<Meet>("meets").delete();
  }
}
