import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import MeetDao, { MeetDaoAddOneInput, MeetDaoEditOneInput, MeetDaoGetManyArgs } from "../dao/MeetDao";
import {
  Meet,
  MutationCreateMeetArgs,
  MutationDeleteMeetArgs,
  MutationEditMeetArgs,
  MutationRegisterForMeetArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { validateAtLeastOneFieldPresent } from "../util/validateAtLeastOneFieldPresent";

export default class MeetResolverValidator {
  constructor(private meetDao: MeetDao) {}

  async getMany(args: {}, _context: ServerContext): Promise<MeetDaoGetManyArgs> {
    // TODO: Validate the search query arguments later
    return args;
  }

  async addOne({ input }: MutationCreateMeetArgs, _context: ServerContext): Promise<MeetDaoAddOneInput> {
    //TODO: Validate createMeet args
    return input;
  }

  async editOne(
    { id, input }: MutationEditMeetArgs,
    _context: ServerContext,
  ): Promise<{ id: string; input: MeetDaoEditOneInput }> {
    // Check if meet id exists in db
    await this.meetDao.getOne({ id }).then((meet) => ensureExists("Meet")(meet));

    // Handle when input has no fields to update (knex doesn't like this)
    validateAtLeastOneFieldPresent(input);

    return { id, input };
  }

  async deleteOne({ id }: MutationDeleteMeetArgs): Promise<MutationDeleteMeetArgs> {
    // Check if meet id exists in db
    const meet = await this.meetDao.getOne({ id });
    ensureExists("Meet")(meet);
    return { id };
  }

  async registerForMeet(
    { meetId }: MutationRegisterForMeetArgs,
    context: ServerContext,
  ): Promise<MutationRegisterForMeetArgs> {
    const currentUserId = context.getUserId();

    if (!currentUserId) {
      throw new AuthenticationError("You must be logged in to register for a meet!");
    }
    // Check if meet id exists in db
    const meet = await this.meetDao.getOne({ id: meetId });
    ensureExists<Meet>("Meet")(meet);
    return { meetId };
  }
}
