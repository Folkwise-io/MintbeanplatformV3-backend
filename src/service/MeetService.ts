import MeetDao from "../dao/MeetDao";
import { Meet } from "../types/gqlGeneratedTypes";

export default class MeetService {
  constructor(private meetDao: MeetDao) {}

  async getRegisteredMeetsOfUser(userId: string): Promise<Meet[]> {
    return this.meetDao.getMany({ registrantId: userId });
  }
}
