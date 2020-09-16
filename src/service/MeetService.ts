import MeetDao from "../dao/MeetDao";
import { Meet } from "../types/gqlGeneratedTypes";
import { Args, EntityService } from "./EntityService";

export default class MeetService implements EntityService<Meet> {
  constructor(private userDao: MeetDao) {}
  async getOne(args: Args, context: any): Promise<Meet> {
    throw new Error("Method not implemented");
  }

  async getMany(args: Args, context: any): Promise<Meet[]> {
    throw new Error("Method not implemented");
  }

  async addOne(args: Args, context: any): Promise<Meet> {
    throw new Error("Method not implemented");
  }
}
