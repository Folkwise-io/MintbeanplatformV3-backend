import { UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import MeetDao from "../dao/MeetDao";
import { MeetServiceAddOneInput, MeetServiceEditOneInput, MeetServiceGetManyArgs } from "../service/MeetService";
import {
  Meet,
  MutationCreateMeetArgs,
  MutationDeleteMeetArgs,
  MutationEditMeetArgs,
  MutationRegisterForMeetArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";

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
    // Check if meet id exists in db
    await this.meetDao.getOne({ id }).then((meet) => ensureExists("Meet")(meet));

    // Handle when input has no fields to update (knex doesn't like this)
    if (Object.keys(input).length === 0) {
      throw new UserInputError("Must edit at least one field!");
    }

    return { id, input };
  }

  async deleteOne({ id }: MutationDeleteMeetArgs): Promise<string> {
    // Check if meet id exists in db
    return this.meetDao
      .getOne({ id })
      .then((meet) => ensureExists("Meet")(meet))
      .then(({ id }) => id);
  }

  async registerForMeet({ meetId }: MutationRegisterForMeetArgs): Promise<string> {
    // Check if meet id exists in db
    return this.meetDao
      .getOne({ id: meetId })
      .then((meet) => ensureExists("Meet")(meet))
      .then(({ id }) => id);
  }
}
