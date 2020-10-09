import { UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanCardDao from "../dao/KanbanCardDao";
import KanbanDao from "../dao/KanbanDao";
import {
  KanbanCardServiceAddOneInput,
  KanbanCardServiceEditOneInput,
  KanbanCardServiceGetManyArgs,
  KanbanCardServiceGetOneArgs,
} from "../service/KanbanCardService";
import {
  CreateKanbanCardInput,
  EditKanbanCardInput,
  KanbanCard,
  MutationCreateKanbanCardArgs,
  MutationDeleteKanbanCardArgs,
  MutationEditKanbanCardArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { ensureType } from "../util/ensureType";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { createKanbanCardInputSchema, editKanbanCardInputSchema } from "./yupSchemas/kanbanCard";

export default class KanbanCardResolverValidator {
  constructor(private kanbanCardDao: KanbanCardDao, private kanbanDao: KanbanDao) {}

  async getOne({ id }: KanbanCardServiceGetOneArgs) {
    ensureType<string>(id, "id", "string");

    return { id };
  }
  async getMany({ kanbanId }: KanbanCardServiceGetManyArgs) {
    ensureType<string>(kanbanId, "kanbanId", "string");

    return { kanbanId };
  }

  async addOne(
    { input }: MutationCreateKanbanCardArgs,
    _context: ServerContext,
  ): Promise<KanbanCardServiceAddOneInput> {
    // Check if kanban card id exists in db
    await this.kanbanDao.getOne({ id: input.kanbanId }).then((kanban) => ensureExists("Kanban")(kanban));

    validateAgainstSchema<CreateKanbanCardInput>(createKanbanCardInputSchema, input);

    return input;
  }

  async editOne(
    { id, input }: MutationEditKanbanCardArgs,
    _context: ServerContext,
  ): Promise<{ id: string; input: KanbanCardServiceEditOneInput }> {
    // If kanban id was changed, check that kanban exists
    if (input.kanbanId) {
      await this.kanbanDao.getOne({ id: input.kanbanId }).then((kanban) => ensureExists("Kanban")(kanban));
    }

    // Check if kanban card id exists in db
    await this.kanbanCardDao.getOne({ id }).then((kanbanCard) => ensureExists("KanbanCard")(kanbanCard));

    // Handle when input has no fields to update (knex doesn't like this)
    if (Object.keys(input).length === 0) {
      throw new UserInputError("Must edit at least one field!");
    }

    validateAgainstSchema<EditKanbanCardInput>(editKanbanCardInputSchema, input);

    return { id, input };
  }

  async deleteOne({ id }: MutationDeleteKanbanCardArgs): Promise<string> {
    // Check if kanban id exists in db
    return this.kanbanCardDao
      .getOne({ id })
      .then((kanbanCard) => ensureExists<KanbanCard>("KanbanCard")(kanbanCard))
      .then(({ id }) => id);
  }
}
