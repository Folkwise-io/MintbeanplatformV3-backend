import { UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanSessionDao from "../dao/KanbanSessionDao";
import { KanbanSessionServiceEditOneInput } from "../service/KanbanSessionService";
import {
  KanbanSession,
  MutationDeleteKanbanSessionArgs,
  MutationEditKanbanSessionArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";

export default class KanbanSessionResolverValidator {
  constructor(private kanbanSessionDao: KanbanSessionDao) {}

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
