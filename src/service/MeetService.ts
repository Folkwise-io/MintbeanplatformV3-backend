import MeetDao from "../dao/MeetDao";
import { Meet } from "../types/gqlGeneratedTypes";
import { Args, EntityService } from "./EntityService";

// Only allow ID lookup for now
export interface MeetServiceGetOneArgs {
  id: string;
}

export interface MeetServiceGetManyArgs {
  // TODO: Add search query args to Meets here
}

export interface MeetServiceAddOneInput {
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

export interface MeetServiceEditOneInput {
  meetType?: string | null;
  title?: string | null;
  description?: string | null;
  instructions?: string | null;
  registerLink?: string | null;
  coverImageUrl?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  region?: string | null;
}

export default class MeetService implements EntityService<Meet> {
  constructor(private meetDao: MeetDao) {}
  async getOne(args: MeetServiceGetOneArgs, context: any): Promise<Meet> {
    return this.meetDao.getOne(args);
  }

  async getMany(args: MeetServiceGetManyArgs, context: any): Promise<Meet[]> {
    return this.meetDao.getMany(args);
  }

  async addOne(input: MeetServiceAddOneInput, context: any): Promise<Meet> {
    return this.meetDao.addOne(input);
  }

  async editOne(id: string, input: MeetServiceEditOneInput, context: any): Promise<Meet> {
    return this.meetDao.editOne(id, input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.meetDao.deleteOne(id);
  }
}
