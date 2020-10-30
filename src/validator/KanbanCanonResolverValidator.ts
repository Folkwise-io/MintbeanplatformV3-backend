import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanCanonDao from "../dao/KanbanCanonDao";
import { KanbanCanonServiceAddOneInput, KanbanCanonServiceEditOneInput } from "../service/KanbanCanonService";
import {
  MutationCreateKanbanCanonArgs,
  MutationDeleteKanbanCanonArgs,
  MutationEditKanbanCanonArgs,
} from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { validateAtLeastOneFieldPresent } from "../util/validateAtLeastOneFieldPresent";
import { createKanbanCanonInputSchema, editKanbanCanonInputSchema } from "./yupSchemas/kanbanCanon";

export default class KanbanCanonResolverValidator {
  constructor(private kanbanCanonDao: KanbanCanonDao) {}

  async addOne(
    { input }: MutationCreateKanbanCanonArgs,
    context: ServerContext,
  ): Promise<MutationCreateKanbanCanonArgs> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to create new kanban canons!");
    }
    validateAgainstSchema<KanbanCanonServiceAddOneInput>(createKanbanCanonInputSchema, input);
    return { input };
  }

  async deleteOne(
    { id }: MutationDeleteKanbanCanonArgs,
    context: ServerContext,
  ): Promise<MutationDeleteKanbanCanonArgs> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to delete kanban canons!");
    }

    await this.kanbanCanonDao.getOne({ id }).then((kanbanCanon) => ensureExists("Kanban Canon")(kanbanCanon));

    return { id };
  }

  async editOne(
    { id, input }: MutationEditKanbanCanonArgs,
    context: ServerContext,
  ): Promise<MutationEditKanbanCanonArgs> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to edit kanban canons!");
    }

    validateAtLeastOneFieldPresent(input);

    // Check if kanban canon id exists in db
    await this.kanbanCanonDao.getOne({ id }).then((kanbanCanon) => ensureExists("Kanban Canon")(kanbanCanon));

    validateAgainstSchema<KanbanCanonServiceEditOneInput>(editKanbanCanonInputSchema, input);
    return { id, input };
  }
}
