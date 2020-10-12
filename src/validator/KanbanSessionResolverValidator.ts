import { UserInputError, ForbiddenError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanSessionDao from "../dao/KanbanSessionDao";
import { KanbanSessionServiceAddOneInput, KanbanSessionServiceEditOneInput } from "../service/KanbanSessionService";
import {
  KanbanSession,
  MutationCreateKanbanSessionArgs,
  MutationDeleteKanbanSessionArgs,
  MutationEditKanbanSessionArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";

export default class KanbanSessionResolverValidator {
  constructor(private kanbanSessionDao: KanbanSessionDao) {}

  async addOne(
    { input }: MutationCreateKanbanSessionArgs,
    _context: ServerContext,
  ): Promise<{ input: KanbanSessionServiceAddOneInput }> {
    // For meet kanban sessions, throw error if kanban session for the user on that meet already exists in db
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
  async editOne(
    { id, input }: MutationEditKanbanSessionArgs,
    _context: ServerContext,
  ): Promise<{ id: string; input: KanbanSessionServiceEditOneInput }> {
    // Check if kanban id exists in db
    await this.kanbanSessionDao.getOne({ id }).then((kanbanSession) => ensureExists("KanbanSession")(kanbanSession));

    // Handle when input has no fields to update (knex doesn't like this)
    if (Object.keys(input).length === 0) {
      throw new UserInputError("Must edit at least one field!");
    }

    return { id, input };
  }

  async deleteOne({ id }: MutationDeleteKanbanSessionArgs): Promise<string> {
    // Check if kanban session id exists in db

    return this.kanbanSessionDao
      .getOne({ id })
      .then((kanbanSession) => ensureExists<KanbanSession>("KanbanSession")(kanbanSession))
      .then(({ id }) => id);
  }
}
