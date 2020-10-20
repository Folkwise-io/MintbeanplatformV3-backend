import { UserInputError, ForbiddenError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanSessionDao from "../dao/KanbanSessionDao";
import UserDao from "../dao/UserDao";
import { KanbanSessionServiceAddOneInput } from "../service/KanbanSessionService";
import { KanbanSession, MutationDeleteKanbanSessionArgs } from "../types/gqlGeneratedTypes";
import { User } from "../types/user";
import { ensureExists } from "../util/ensureExists";

export default class KanbanSessionResolverValidator {
  constructor(private kanbanSessionDao: KanbanSessionDao, private userDao: UserDao) {}

  async addOne(
    { input }: { input: KanbanSessionServiceAddOneInput },
    context: ServerContext,
  ): Promise<{ input: KanbanSessionServiceAddOneInput }> {
    // ensure there is a userId associated with this request via cookies
    if (!input.userId) {
      throw new UserInputError("You can't create a kanban session unless you're logged in!");
    }

    // // ensure user exists
    this.userDao.getOne({ id: input.userId }).then((user) => ensureExists<User>("User")(user));

    // For meet kanban sessions, throw error if user already has a kanban session for given meet
    if (input.meetId) {
      const existing = await this.kanbanSessionDao.getOne({ ...input });
      if (existing) throw new ForbiddenError("You already have a kanban session on this meet!");
    }

    // Handle when input has no fields to update (knex doesn't like this)
    if (Object.keys(input).length === 0) {
      throw new UserInputError("Must edit at least one field!");
    }

    return { input };
  }

  // async editOne(
  //   { id, input }: MutationEditKanbanSessionArgs,
  //   _context: ServerContext,
  // ): Promise<{ id: string; input: KanbanSessionServiceEditOneInput }> {
  //   // Check if kanban id exists in db
  //   await this.kanbanSessionDao.getOne({ id }).then((kanbanSession) => ensureExists("KanbanSession")(kanbanSession));

  //   // Handle when input has no fields to update (knex doesn't like this)
  //   if (Object.keys(input).length === 0) {
  //     throw new UserInputError("Must edit at least one field!");
  //   }

  //   return { id, input };
  // }

  async deleteOne({ id }: MutationDeleteKanbanSessionArgs): Promise<string> {
    // Check if kanban session id exists in db

    return this.kanbanSessionDao
      .getOne({ id })
      .then((kanbanSession) => ensureExists<KanbanSession>("KanbanSession")(kanbanSession))
      .then(({ id }) => id);
  }
}
