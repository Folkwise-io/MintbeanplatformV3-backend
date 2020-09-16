import { ServerContext } from "../buildServerContext";
import MeetDao from "../dao/MeetDao";
import { MeetServiceGetManyArgs } from "../service/MeetService";

export default class MeetResolverValidator {
  constructor(private meetDao: MeetDao) {}

  async getMany(args: any, _context: ServerContext): Promise<MeetServiceGetManyArgs> {
    // TODO: Validate the search query arguments later
    return args;
  }
}
