import Knex from "knex";
import MeetRegistrationDaoKnex from "../../../src/dao/MeetRegistrationDaoKnex";
import MeetRegistration from "../../../src/types/MeetRegistration";

export default class TestMeetRegistrationDaoKnex extends MeetRegistrationDaoKnex {
  constructor(knex: Knex) {
    super(knex);
  }

  async addMany(meetRegistrations: MeetRegistration[]): Promise<void> {
    return this.knex<MeetRegistration>("meetRegistrations").insert(meetRegistrations);
  }

  async deleteAll(): Promise<void> {
    return this.knex<MeetRegistration>("meetRegistrations").delete();
  }
}
