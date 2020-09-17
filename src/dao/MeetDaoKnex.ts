import Knex from "knex";
import {
  MeetServiceAddOneInput,
  MeetServiceEditOneInput,
  MeetServiceGetManyArgs,
  MeetServiceGetOneArgs,
} from "../service/MeetService";
import { Meet } from "../types/gqlGeneratedTypes";
import MeetDao from "./MeetDao";

// Remove the ending Z (which denotes UTC) from startTime and endTime
function formatMeets(meets: any[]) {
  return meets.map((meet) => ({
    ...meet,
    startTime: meet.startTime.toISOString().slice(0, -1),
    endTime: meet.endTime.toISOString().slice(0, -1),
  }));
}

export default class MeetDaoKnex implements MeetDao {
  constructor(private knex: Knex) {}

  async getOne(args: MeetServiceGetOneArgs): Promise<Meet> {
    const meet = this.knex<Meet>("meets").where(args).first();
    return meet as Promise<Meet>;
  }

  async getMany(args: MeetServiceGetManyArgs): Promise<Meet[]> {
    const meets = await this.knex("meets")
      .where({ ...args, deleted: false })
      .orderBy("startTime", "desc");

    const formattedMeets = formatMeets(meets);

    return formattedMeets;
  }

  async addOne(args: MeetServiceAddOneInput): Promise<Meet> {
    const newMeets = (await this.knex("meets").insert(args).returning("*")) as Meet[];
    const formattedMeets = formatMeets(newMeets);
    return formattedMeets[0];
  }

  async editOne(id: string, input: MeetServiceEditOneInput): Promise<Meet> {
    const newMeets = (await this.knex("meets").where({ id }).update(input).returning("*")) as Meet[];
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
