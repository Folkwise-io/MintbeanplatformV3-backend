import KanbanCardDao from "../dao/KanbanCardDao";
import { KanbanCard, QueryKanbanCardsArgs, UpdateKanbanCardInput } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface KanbanCardServiceGetManyArgs extends QueryKanbanCardsArgs {}
export interface KanbanCardServiceGetOneArgs {
  id: string;
  kanbanId: string;
}
export interface KanbanCardServiceUpdateOneInput extends UpdateKanbanCardInput {}

export default class KanbanCardService implements EntityService<KanbanCard> {
  constructor(private kanbanCardDao: KanbanCardDao) {}
  async getMany(args: KanbanCardServiceGetManyArgs): Promise<KanbanCard[]> {
    return this.kanbanCardDao.getMany(args);
  }
  async updateOne(input: KanbanCardServiceUpdateOneInput): Promise<KanbanCard> {
    await this.kanbanCardDao.upsertOne(input);
    return this.kanbanCardDao.getOne(input);
  }
}
