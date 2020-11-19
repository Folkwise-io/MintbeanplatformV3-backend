import MeetDao, {
  MeetDaoAddOneInput,
  MeetDaoEditOneInput,
  MeetDaoGetManyArgs,
  MeetDaoGetOneArgs,
} from "../dao/MeetDao";
import { Meet } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export default class MeetService implements EntityService<Meet | undefined> {
  constructor(private meetDao: MeetDao) {}
  async getOne(args: MeetDaoGetOneArgs): Promise<Meet | undefined> {
    return this.meetDao.getOne(args);
  }

  async getMany(args: MeetDaoGetManyArgs): Promise<Meet[]> {
    return this.meetDao.getMany(args);
  }

  async addOne(input: MeetDaoAddOneInput): Promise<Meet> {
    return this.meetDao.addOne(input);
  }

  async editOne(id: string, input: MeetDaoEditOneInput): Promise<Meet> {
    return this.meetDao.editOne(id, input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.meetDao.deleteOne(id);
  }

  async getRegisteredMeetsOfUser(userId: string): Promise<Meet[]> {
    return this.meetDao.getMany({ registrantId: userId });
  }
}
