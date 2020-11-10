import Knex from "knex";
import { MeetRegistrationServiceAddOneArgs } from "../service/MeetRegistrationService";
import MeetRegistration from "../types/MeetRegistration";
import handleDatabaseError from "../util/handleDatabaseError";
import MeetRegistrationDao from "./MeetRegistrationDao";

export default class MeetRegistrationDaoKnex implements MeetRegistrationDao {
  constructor(private knex: Knex) {}

  getOne(args: any): Promise<MeetRegistration> {
    throw new Error("Method not implemented.");
  }

  async getMany(args: any): Promise<MeetRegistration[]> {
    // Only tested with projectId lookup for now
    // TODO: Add support for userId lookup
    return handleDatabaseError(async () => {
      throw new Error("Method not implemented.");
    });
  }

  async addOne(args: MeetRegistrationServiceAddOneArgs): Promise<MeetRegistration> {
    return handleDatabaseError(async () => {
      const meetRegistrations = await this.knex<MeetRegistration>("meetRegistrations").insert(args).returning("*");
      return meetRegistrations[0]; // Cannot chain .first() on insert statements
    });
  }

  editOne(id: string, input: any): Promise<MeetRegistration> {
    throw new Error("Method not implemented.");
  }

  deleteOne(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  // Test manager functions
  async addMany(meetRegistrations: MeetRegistration[]): Promise<void> {
    return this.knex<MeetRegistration>("meetRegistrations").insert(meetRegistrations);
  }

  deleteAll(): Promise<void> {
    return this.knex<MeetRegistration>("meetRegistrations").delete();
  }
}
