import KanbanCardDao from "../dao/KanbanCardDao";
import {
  CreateKanbanCardInput,
  EditKanbanCardInput,
  KanbanCard,
  QueryKanbanCardArgs,
  QueryKanbanCardsArgs,
} from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

// Only allow ID lookup for now
export interface KanbanCardServiceGetOneArgs extends QueryKanbanCardArgs {}

export interface KanbanCardServiceGetManyArgs extends QueryKanbanCardsArgs {}

export interface KanbanCardServiceAddOneInput extends CreateKanbanCardInput {}

export interface KanbanCardServiceEditOneInput extends EditKanbanCardInput {}

export default class KanbanCardService implements EntityService<KanbanCard> {
  constructor(private kanbanCardDao: KanbanCardDao) {}

  async getOne(args: KanbanCardServiceGetOneArgs): Promise<KanbanCard> {
    return this.kanbanCardDao.getOne(args);
  }

  async getMany(args: KanbanCardServiceGetManyArgs): Promise<KanbanCard[]> {
    return this.kanbanCardDao.getMany(args);
  }

  async addOne(input: KanbanCardServiceAddOneInput): Promise<KanbanCard> {
    return this.kanbanCardDao.addOne(input);
  }

  async editOne(id: string, input: KanbanCardServiceEditOneInput): Promise<KanbanCard> {
    return this.kanbanCardDao.editOne(id, input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanCardDao.deleteOne(id);
  }
}
