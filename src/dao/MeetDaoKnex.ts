import Knex from "knex";
import {
  MeetServiceAddOneInput,
  MeetServiceEditOneInput,
  MeetServiceGetManyArgs,
  MeetServiceGetOneArgs,
} from "../service/MeetService";
import { Meet } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
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
    return handleDatabaseError(async () => {
      const meet = await this.knex("meets")
        .where({ ...args, deleted: false })
        .first();
      // TODO: clean this typescript-constrained mess
      if (meet) {
        const [formattedMeet] = formatMeets([meet]);
        return formattedMeet as Meet;
      }
      return meet as any;
    });
  }

  async getMany(args: MeetServiceGetManyArgs): Promise<Meet[]> {
    return handleDatabaseError(async () => {
      const meets = await this.knex("meets")
        .where({ ...args, deleted: false })
        .orderBy("startTime", "desc");

      const formattedMeets = formatMeets(meets);

      return formattedMeets;
    });
  }

  async addOne(args: MeetServiceAddOneInput): Promise<Meet> {
    return handleDatabaseError(async () => {
      const newMeets = (await this.knex("meets").insert(args).returning("*")) as Meet[];
      const formattedMeets = formatMeets(newMeets);
      return formattedMeets[0];
    });
  }

  async editOne(id: string, input: MeetServiceEditOneInput): Promise<Meet> {
    return handleDatabaseError(async () => {
      const newMeets = (await this.knex("meets")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as Meet[];
      const formattedMeets = formatMeets(newMeets);
      return formattedMeets[0];
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("meets").where({ id }).update({ deleted: true });
      return true;
    });
  }

  // Testing methods below, for TestManager to call
  async addMany(meets: Meet[]): Promise<void> {
    return this.knex<Meet>("meets").insert(meets);
  }

  deleteAll(): Promise<void> {
    return this.knex<Meet>("meets").delete();
  }
}
