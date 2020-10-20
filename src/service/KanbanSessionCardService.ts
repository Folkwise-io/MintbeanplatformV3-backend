import KanbanSessionCardDao from "../dao/KanbanSessionCardDao";
import {
  CreateKanbanSessionCardInput,
  EditKanbanSessionCardInput,
  KanbanSessionCard,
  QueryKanbanSessionCardArgs,
  QueryKanbanSessionCardsArgs,
} from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

// Only allow ID lookup for now
export interface KanbanSessionCardServiceGetOneArgs extends QueryKanbanSessionCardArgs {}
export interface KanbanSessionCardServiceGetManyArgs extends QueryKanbanSessionCardsArgs {}

export interface KanbanSessionCardServiceAddOneInput extends CreateKanbanSessionCardInput {}

export interface KanbanSessionCardServiceEditOneInput extends EditKanbanSessionCardInput {}

export default class KanbanSessionCardService implements EntityService<KanbanSessionCard> {
  constructor(private kanbanSessionCardDao: KanbanSessionCardDao) {}

  async getOne(args: KanbanSessionCardServiceGetOneArgs): Promise<KanbanSessionCard> {
    return this.kanbanSessionCardDao.getOne(args);
  }

  async getMany(args: KanbanSessionCardServiceGetManyArgs): Promise<KanbanSessionCard[]> {
    return this.kanbanSessionCardDao.getMany(args);
  }

  async addOne(input: KanbanSessionCardServiceAddOneInput): Promise<KanbanSessionCard> {
    return this.kanbanSessionCardDao.addOne(input);
  }

  async editOne(id: string, input: KanbanSessionCardServiceEditOneInput): Promise<KanbanSessionCard> {
    return this.kanbanSessionCardDao.editOne(id, input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanSessionCardDao.deleteOne(id);
  }
}
