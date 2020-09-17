import Knex from "knex";
import { MeetServiceAddOneArgs, MeetServiceGetManyArgs } from "../service/MeetService";
import { Meet } from "../types/gqlGeneratedTypes";
import MeetDao from "./MeetDao";

function formatMeets(meets: any[]) {
  return meets.map((meet) => ({
    ...meet,
    startTime: meet.startTime.toISOString().slice(0, -1),
    endTime: meet.endTime.toISOString().slice(0, -1),
  }));
}

export default class MeetDaoKnex implements MeetDao {
  constructor(private knex: Knex) {}

  async getMany(args: MeetServiceGetManyArgs): Promise<Meet[]> {
    const meets = await this.knex("meets")
      .where({ ...args, deleted: false })
      .orderBy("startTime", "desc");

    // Remove the Z from startTime and endTime
    const formattedMeets = formatMeets(meets);

    return formattedMeets;
  }

  async addOne(args: MeetServiceAddOneArgs): Promise<Meet> {
    const newMeets = (await this.knex("meets").insert(args).returning("*")) as Meet[];
    const formattedMeets = formatMeets(newMeets);
    return formattedMeets[0];
  }

  // Testing methods below, for TestManager to call
  async addMany(meets: Meet[]): Promise<void> {
    return this.knex<Meet>("meets").insert(meets);
  }

  deleteAll(): Promise<void> {
    return this.knex<Meet>("meets").delete();
  }
}
