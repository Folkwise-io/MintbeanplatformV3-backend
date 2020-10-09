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
  KanbanCard,
  MutationCreateKanbanCardArgs,
  MutationDeleteKanbanCardArgs,
  MutationEditKanbanCardArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { ensureType } from "../util/ensureType";
import { createKanbanCardInputSchema, editKanbanCardInputSchema } from "./yupSchemas/kanbanCard";

export default class KanbanCardResolverValidator {
  constructor(private kanbanCardDao: KanbanCardDao, private kanbanDao: KanbanDao) {}

  async getOne({ id }: KanbanCardServiceGetOneArgs) {
    ensureType<string>(id, "id", "string");
    // if (!id || typeof id !== "string") {
    //   throw new UserInputError("Expected id with a string value");
    // }
    return { id };
  }
  async getMany({ kanbanId }: KanbanCardServiceGetManyArgs) {
    ensureType<string>(kanbanId, "kanbanId", "string");
    // if (!kanbanId || typeof kanbanId !== "string") {
    //   throw new UserInputError("Expected kanbanId with a string value");
    // }
    return { kanbanId };
  }

  async addOne(
    { input }: MutationCreateKanbanCardArgs,
    _context: ServerContext,
  ): Promise<KanbanCardServiceAddOneInput> {
    // Check if kanban card id exists in db
    await this.kanbanDao.getOne({ id: input.kanbanId }).then((kanban) => ensureExists("Kanban")(kanban));

    try {
      createKanbanCardInputSchema.validateSync(input);
    } catch (e) {
      throw new UserInputError(e.message);
    }

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

    try {
      editKanbanCardInputSchema.validateSync(input);
    } catch (e) {
      throw new UserInputError(e.message);
    }

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
