import Knex from "knex";

import { Meet, RegisterLinkStatus } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import MeetDao, { MeetDaoAddOneInput, MeetDaoEditOneInput, MeetDaoGetManyArgs, MeetDaoGetOneArgs } from "./MeetDao";
import { calculateMeetRegisterLinkStatus } from "../util/timeUtils";

// "Fresh out of the DB oven" meet type. Not extending the Meet type because Meet type includes composed properties that don't exist in DB
interface MeetRaw {
  id: string;
  meetType: string;
  title: string;
  description: string;
  longDescription?: string;
  instructions: string;
  registerLink?: string;
  coverImageUrl: string;
  region: string;
  createdAt: Date;
  updatedAt: Date;
  kanbanCanonId: string | null | undefined;
  deleted?: boolean;
  // startTime and endTime come out of DB as Date
  startTime: Date;
  endTime: Date;
}

// Stringify dates and remove the ending Z (which denotes UTC) from startTime and endTime
function formatMeet(meet: MeetRaw): Meet {
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
}

function formatMeets(meets: MeetRaw[]): Meet[] {
  return meets.map((meet) => formatMeet(meet));
}

export default class MeetDaoKnex implements MeetDao {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getOne(args: MeetDaoGetOneArgs): Promise<Meet | undefined> {
    return handleDatabaseError(async () => {
      const meet = (await this.knex("meets")
        .where({ ...args, deleted: false })
        .first()) as MeetRaw;
      if (meet) {
        return formatMeet(meet);
      }
      return meet;
    });
  }

  // Gets the meets that a user has registered for
  async getMany(args: MeetDaoGetManyArgs): Promise<Meet[]> {
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

  async addOne(args: MeetDaoAddOneInput): Promise<Meet> {
    return handleDatabaseError(async () => {
      const newMeets = (await this.knex("meets").insert(args).returning("*")) as MeetRaw[];
      const formattedMeet = formatMeet(newMeets[0]);
      return formattedMeet;
    });
  }

  async editOne(id: string, input: MeetDaoEditOneInput): Promise<Meet> {
    return handleDatabaseError(async () => {
      const updatedMeets = (await this.knex("meets")
        .where({ id })
        .update({ ...input, updatedAt: this.knex.fn.now() })
        .returning("*")) as MeetRaw[];
      const formattedMeet = formatMeet(updatedMeets[0]);
      return formattedMeet;
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("meets").where({ id }).update({ deleted: true });
      return true;
    });
  }
}
