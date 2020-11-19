import MeetRegistrationDao, { MeetRegistrationDaoAddOneArgs } from "../dao/MeetRegistrationDao";
import MeetRegistration from "../types/MeetRegistration";
import { EntityService } from "./EntityService";

export default class MeetRegistrationService implements EntityService<MeetRegistration> {
  constructor(private meetRegistrationDao: MeetRegistrationDao) {}

  async addOne(args: MeetRegistrationDaoAddOneArgs): Promise<MeetRegistration> {
    return this.meetRegistrationDao.addOne(args);
  }
}
