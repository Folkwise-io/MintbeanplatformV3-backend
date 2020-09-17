import { Server } from "http";
import { ServerContext } from "../buildServerContext";
import MeetDao from "../dao/MeetDao";
import { MeetServiceAddOneInput, MeetServiceEditOneInput, MeetServiceGetManyArgs } from "../service/MeetService";
import { EditMeetInput, MutationCreateMeetArgs, MutationEditMeetArgs } from "../types/gqlGeneratedTypes";

export default class MeetResolverValidator {
  constructor(private meetDao: MeetDao) {}

  async getMany(args: {}, _context: ServerContext): Promise<MeetServiceGetManyArgs> {
    // TODO: Validate the search query arguments later
    return args;
  }

  async addOne({ input }: MutationCreateMeetArgs, _context: ServerContext): Promise<MeetServiceAddOneInput> {
    //TODO: Validate createMeet args
    return input;
  }

  async editOne(
    { id, input }: MutationEditMeetArgs,
    _context: ServerContext,
  ): Promise<{ id: string; input: MeetServiceEditOneInput }> {
    //TODO: Validate createMeet args
    return { id, input };
  }
}
