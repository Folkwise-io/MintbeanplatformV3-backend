import Knex from "knex";
import MeetRegistration from "../types/meetRegistration";
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

  addOne(args: any): Promise<MeetRegistration> {
    throw new Error("Method not implemented.");
  }

  addMany(meetRegistrations: MeetRegistration[]): Promise<void> {
    return handleDatabaseError(() =>
      this.knex<MeetRegistration>("meetRegistrations").insert(meetRegistrations).returning("*"),
    );
  }

  editOne(id: string, input: any): Promise<MeetRegistration> {
    throw new Error("Method not implemented.");
  }

  deleteOne(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  deleteAll(): Promise<void> {
    return this.knex<MeetRegistration>("meetRegistrations").delete();
  }
}
