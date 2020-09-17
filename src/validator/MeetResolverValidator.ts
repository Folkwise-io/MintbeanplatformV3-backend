import { Server } from "http";
import { ServerContext } from "../buildServerContext";
import MeetDao from "../dao/MeetDao";
import { MeetServiceAddOneArgs, MeetServiceGetManyArgs } from "../service/MeetService";
import { MutationCreateMeetArgs } from "../types/gqlGeneratedTypes";

export default class MeetResolverValidator {
  constructor(private meetDao: MeetDao) {}

  async getMany(args: {}, _context: ServerContext): Promise<MeetServiceGetManyArgs> {
    // TODO: Validate the search query arguments later
    return args;
  }

  async addOne({ input }: MutationCreateMeetArgs, _context: Server): Promise<MeetServiceAddOneArgs> {
    //TODO: Validate createMeet args
    return input;
  }
}
