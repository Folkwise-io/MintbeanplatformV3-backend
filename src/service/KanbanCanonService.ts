import KanbanCanonDao from "../dao/KanbanCanonDao";
import {
  CreateKanbanCanonInput,
  EditKanbanCanonInput,
  KanbanCanon,
  QueryKanbanCanonArgs,
} from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

// Only allow ID lookup for now
export interface KanbanCanonServiceGetOneArgs extends QueryKanbanCanonArgs {}
export interface KanbanCanonServiceAddOneInput extends CreateKanbanCanonInput {}
export interface KanbanCanonServiceEditOneInput extends EditKanbanCanonInput {}
// export interface KanbanCanonServiceEditOneInput extends EditKanbanCanonInput {}

export default class KanbanCanonService implements EntityService<KanbanCanon> {
  constructor(private kanbanCanonDao: KanbanCanonDao) {}
  async getOne(args: KanbanCanonServiceGetOneArgs): Promise<KanbanCanon> {
    return this.kanbanCanonDao.getOne(args);
  }

  async getMany(): Promise<KanbanCanon[]> {
    return this.kanbanCanonDao.getMany();
  }

  async addOne(input: KanbanCanonServiceAddOneInput): Promise<KanbanCanon> {
    return this.kanbanCanonDao.addOne(input);
  }

  async editOne(id: string, input: KanbanCanonServiceEditOneInput): Promise<KanbanCanon> {
    return this.kanbanCanonDao.editOne(id, input);
  }

  //   async deleteOne(id: string): Promise<boolean> {
  //     return this.kanbanCanonDao.deleteOne(id);
  //   }
}
