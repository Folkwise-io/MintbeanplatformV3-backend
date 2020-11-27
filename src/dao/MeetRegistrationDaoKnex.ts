import Knex from "knex";
import MeetRegistration from "../types/MeetRegistration";
import handleDatabaseError from "../util/handleDatabaseError";
import MeetRegistrationDao, { MeetRegistrationDaoAddOneArgs } from "./MeetRegistrationDao";

export default class MeetRegistrationDaoKnex implements MeetRegistrationDao {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getMany(args: any): Promise<MeetRegistration[]> {
    // Only tested with projectId lookup for now
    // TODO: Add support for userId lookup
    return handleDatabaseError(async () => {
      throw new Error("Method not implemented.");
    });
  }

  async addOne(args: MeetRegistrationDaoAddOneArgs): Promise<MeetRegistration> {
    return handleDatabaseError(async () => {
      const meetRegistrations = await this.knex<MeetRegistration>("meetRegistrations").insert(args).returning("*");
      return meetRegistrations[0]; // Cannot chain .first() on insert statements
    });
  }
}
