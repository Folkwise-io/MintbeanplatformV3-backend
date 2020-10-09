import { UserInputError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanDao from "../dao/KanbanDao";
import { KanbanServiceAddOneInput, KanbanServiceEditOneInput } from "../service/KanbanService";
import {
  CreateKanbanInput,
  EditKanbanInput,
  Kanban,
  MutationCreateKanbanArgs,
  MutationDeleteKanbanArgs,
  MutationEditKanbanArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { createKanbanInputSchema, editKanbanInputSchema } from "./yupSchemas/kanban";

export default class KanbanResolverValidator {
  constructor(private kanbanDao: KanbanDao) {}

  async addOne({ input }: MutationCreateKanbanArgs, _context: ServerContext): Promise<KanbanServiceAddOneInput> {
    validateAgainstSchema<CreateKanbanInput>(createKanbanInputSchema, input);
    return input;
  }

  async editOne(
    { id, input }: MutationEditKanbanArgs,
    _context: ServerContext,
  ): Promise<{ id: string; input: KanbanServiceEditOneInput }> {
    // Check if kanban id exists in db
    await this.kanbanDao.getOne({ id }).then((kanban) => ensureExists("Kanban")(kanban));

    // Handle when input has no fields to update (knex doesn't like this)
    if (Object.keys(input).length === 0) {
      throw new UserInputError("Must edit at least one field!");
    }
    validateAgainstSchema<EditKanbanInput>(editKanbanInputSchema, input);

    return { id, input };
  }

  async deleteOne({ id }: MutationDeleteKanbanArgs): Promise<string> {
    // Check if kanban id exists in db
    return this.kanbanDao
      .getOne({ id })
      .then((kanban) => ensureExists<Kanban>("Kanban")(kanban))
      .then(({ id }) => id);
  }
}
