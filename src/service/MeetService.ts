import MeetDao from "../dao/MeetDao";
import { Meet } from "../types/gqlGeneratedTypes";
import { Args, EntityService } from "./EntityService";

export interface MeetServiceGetManyArgs {
  // TODO: Add search query args to Meets here
}

export interface MeetServiceAddOneArgs {
  meetType: string;
  title: string;
  description: string;
  instructions: string;
  registerLink?: string | null;
  coverImageUrl: string;
  startTime: string;
  endTime: string;
  region: string;
}

export default class MeetService implements EntityService<Meet> {
  constructor(private meetDao: MeetDao) {}
  async getOne(args: Args, context: any): Promise<Meet> {
    throw new Error("Method not implemented");
  }

  async getMany(args: MeetServiceGetManyArgs, context: any): Promise<Meet[]> {
    return this.meetDao.getMany(args);
  }

  async addOne(args: MeetServiceAddOneArgs, context: any): Promise<Meet> {
    return this.meetDao.addOne(args);
  }
}
