import Knex from "knex";
import {
  MeetServiceAddOneInput,
  MeetServiceEditOneInput,
  MeetServiceGetManyArgs,
  MeetServiceGetOneArgs,
} from "../service/MeetService";
import { Meet, RegisterLinkStatus } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import MeetDao from "./MeetDao";
import { calculateMeetRegisterLinkStatus } from "../util/timeUtils";

// Remove the ending Z (which denotes UTC) from startTime and endTime
function formatMeets(meets: any[]): Meet[] {
  return meets.map((meet) => {
    const startTime = meet.startTime.toISOString().slice(0, -1);
    const endTime = meet.endTime.toISOString().slice(0, -1);
    const registerLinkStatus = calculateMeetRegisterLinkStatus({ ...meet, startTime, endTime });

    const dto: Meet = {
      ...meet,
      startTime,
      endTime,
      registerLinkStatus,
    };

    if (registerLinkStatus === RegisterLinkStatus.Closed) {
      delete dto.registerLink;
    }

    return dto;
  });
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
        return formatMeets([meet])[0];
      }
      return meet as any;
    });
  }

  // Gets the meets that a user has registered for
  async getMany(args: MeetServiceGetManyArgs): Promise<Meet[]> {
    return handleDatabaseError(async () => {
      // Run a join query if registrantId is supplied
      if (args.registrantId) {
        return this.knex
          .select("meets.*") // Need to avoid colision with id from meetRegistration
          .from("meets")
          .join("meetRegistrations", "meetRegistrations.meetId", "=", "meets.id")
          .where({
            "meetRegistrations.userId": args.registrantId,
            "meetRegistrations.deleted": false,
            "meets.deleted": false,
          })
          .orderBy("startTime", "desc")
          .then(formatMeets);
      } else {
        return this.knex("meets")
          .where({ ...args, deleted: false })
          .orderBy("startTime", "desc")
          .then(formatMeets);
      }
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
