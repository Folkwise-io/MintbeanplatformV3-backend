import KanbanCanonCardDao from "../dao/KanbanCanonCardDao";
import {
  CreateKanbanCanonCardInput,
  EditKanbanCanonCardInput,
  KanbanCanonCard,
  KanbanCanonCardStatusEnum,
  QueryKanbanCanonCardArgs,
  QueryKanbanCanonCardsArgs,
} from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface KanbanCanonCardServiceGetOneArgs extends QueryKanbanCanonCardArgs {}
export interface KanbanCanonCardServiceGetManyArgs extends QueryKanbanCanonCardsArgs {}
export interface KanbanCanonCardServiceAddOneInput extends CreateKanbanCanonCardInput {
  status?: KanbanCanonCardStatusEnum | null;
}
export interface KanbanCanonCardServiceEditOneInput extends EditKanbanCanonCardInput {
  status?: KanbanCanonCardStatusEnum | null;
}

export default class KanbanCanonCardService implements EntityService<KanbanCanonCard> {
  constructor(private kanbanCanonCardDao: KanbanCanonCardDao) {}
  async getOne(args: KanbanCanonCardServiceGetOneArgs): Promise<KanbanCanonCard> {
    return this.kanbanCanonCardDao.getOne(args);
  }

  async getMany(args: KanbanCanonCardServiceGetManyArgs): Promise<KanbanCanonCard[]> {
    return this.kanbanCanonCardDao.getMany(args);
  }

  async addOne(input: KanbanCanonCardServiceAddOneInput): Promise<KanbanCanonCard> {
    return this.kanbanCanonCardDao.addOne(input);
  }

  async editOne(id: string, input: KanbanCanonCardServiceEditOneInput): Promise<KanbanCanonCard> {
    return this.kanbanCanonCardDao.editOne(id, input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanCanonCardDao.deleteOne(id);
  }
}
