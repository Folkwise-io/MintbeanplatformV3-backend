import { UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanSessionCardDao from "../dao/KanbanSessionCardDao";
import KanbanSessionDao from "../dao/KanbanSessionDao";
import {
  KanbanSessionCardServiceAddOneInput,
  KanbanSessionCardServiceEditOneInput,
  KanbanSessionCardServiceGetManyArgs,
  KanbanSessionCardServiceGetOneArgs,
} from "../service/KanbanSessionCardService";
import {
  CreateKanbanSessionCardInput,
  EditKanbanSessionCardInput,
  KanbanSessionCard,
  MutationCreateKanbanSessionCardArgs,
  MutationDeleteKanbanSessionCardArgs,
  MutationEditKanbanSessionCardArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { createKanbanSessionCardInputSchema, editKanbanSessionCardInputSchema } from "./yupSchemas/kanbanSessionCard";

export default class KanbanSessionCardResolverValidator {
  constructor(private kanbanSessionCardDao: KanbanSessionCardDao, private kanbanSessionDao: KanbanSessionDao) {}

  async getOne({ id }: KanbanSessionCardServiceGetOneArgs) {
    // Add validation if needed
    return { id };
  }
  async getMany({ kanbanSessionId }: KanbanSessionCardServiceGetManyArgs) {
    // Add validation if needed
    return { kanbanSessionId };
  }

  async addOne(
    { input }: MutationCreateKanbanSessionCardArgs,
    _context: ServerContext,
  ): Promise<KanbanSessionCardServiceAddOneInput> {
    // Make sure the given kanban session exists
    await this.kanbanSessionDao
      .getOne({ id: input.kanbanSessionId })
      .then((kanbanSession) => ensureExists("KanbanSession")(kanbanSession));

    validateAgainstSchema<CreateKanbanSessionCardInput>(createKanbanSessionCardInputSchema, input);

    return input;
  }

  async editOne(
    { id, input }: MutationEditKanbanSessionCardArgs,
    _context: ServerContext,
  ): Promise<{ id: string; input: KanbanSessionCardServiceEditOneInput }> {
    // Check if kanban session card id exists in db
    await this.kanbanSessionCardDao
      .getOne({ id })
      .then((kanbanSessionCard) => ensureExists("KanbanSessionCard")(kanbanSessionCard));

    // If kanban session id was changed, check that kanban session exists
    if (input.kanbanSessionId) {
      await this.kanbanSessionDao
        .getOne({ id: input.kanbanSessionId })
        .then((kanbanSession) => ensureExists("KanbanSession")(kanbanSession));
    }

    // Handle when input has no fields to update (knex doesn't like this)
    if (Object.keys(input).length === 0) {
      throw new UserInputError("Must edit at least one field!");
    }

    validateAgainstSchema<EditKanbanSessionCardInput>(editKanbanSessionCardInputSchema, input);

    return { id, input };
  }

  async deleteOne({ id }: MutationDeleteKanbanSessionCardArgs): Promise<string> {
    // Check if kanban session id exists in db
    return this.kanbanSessionCardDao
      .getOne({ id })
      .then((kanbanSessionCard) => ensureExists<KanbanSessionCard>("KanbanSessionCard")(kanbanSessionCard))
      .then(({ id }) => id);
  }
}
