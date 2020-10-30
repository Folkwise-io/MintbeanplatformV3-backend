import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";
import KanbanCanonDao from "../dao/KanbanCanonDao";
import { KanbanCanonServiceAddOneInput } from "../service/KanbanCanonService";
import { validateAgainstSchema } from "../util/validateAgainstSchema";
import { createKanbanCanonInputSchema } from "./yupSchemas/kanbanCanon";

export default class KanbanCanonResolverValidator {
  constructor(private kanbanCanonDao: KanbanCanonDao) {}

  async addOne(input: KanbanCanonServiceAddOneInput, context: ServerContext): Promise<KanbanCanonServiceAddOneInput> {
    if (!context.getIsAdmin()) {
      throw new AuthenticationError("You are not authorized to create new kanban canons!");
    }
    validateAgainstSchema<KanbanCanonServiceAddOneInput>(createKanbanCanonInputSchema, input);
    return input;
  }
}
