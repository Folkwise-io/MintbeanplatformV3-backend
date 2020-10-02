import MeetRegistrationDao from "../dao/MeetRegistrationDao";
import MeetRegistration from "../types/meetRegistration";
import { EntityService } from "./EntityService";

export interface MeetRegistrationServiceAddOneArgs {
  userId: string;
  meetId: string;
}

export default class MeetRegistrationService implements EntityService<MeetRegistration> {
  constructor(private meetRegistrationDao: MeetRegistrationDao) {}

  async getOne(args: any, context: any): Promise<MeetRegistration> {
    throw new Error("not emplemented");
  }

  async getMany(args: any): Promise<MeetRegistration[]> {
    throw new Error("not emplemented");
  }

  async addOne(args: MeetRegistrationServiceAddOneArgs, context: any): Promise<MeetRegistration> {
    return this.meetRegistrationDao.addOne(args)
  }

  async addMany(args: MeetRegistrationServiceAddOneArgs[]): Promise<void> {
    throw new Error("not emplemented");
  }
}
