import KanbanCardDao from "../dao/KanbanCardDao";
import { KanbanCard, QueryKanbanCardsArgs } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface KanbanCardServiceGetManyArgs extends QueryKanbanCardsArgs {}

export default class KanbanCardService implements EntityService<KanbanCard> {
  constructor(private kanbanCardDao: KanbanCardDao) {}
  async getMany(args: KanbanCardServiceGetManyArgs): Promise<KanbanCard[]> {
    return this.kanbanCardDao.getMany(args);
  }
}
