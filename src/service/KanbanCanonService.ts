import KanbanCanonDao from "../dao/KanbanCanonDao";
import {
  CreateKanbanCanonInput,
  EditKanbanCanonInput,
  KanbanCanon,
  KanbanCanonCardStatusEnum,
  KanbanCardPositions,
  QueryKanbanCanonArgs,
} from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

// Only allow ID lookup for now
export interface KanbanCanonServiceGetOneArgs extends QueryKanbanCanonArgs {}
export interface KanbanCanonServiceAddOneInput extends CreateKanbanCanonInput {}
export interface KanbanCanonServiceEditOneInput extends EditKanbanCanonInput {}
export interface KanbanCanonServiceUpdateCardPositionsInput {
  cardId: string;
  status: KanbanCanonCardStatusEnum;
  index: number;
}

export default class KanbanCanonService implements EntityService<KanbanCanon> {
  constructor(private kanbanCanonDao: KanbanCanonDao) {}
  async getOne(args: KanbanCanonServiceGetOneArgs): Promise<KanbanCanon> {
    return this.kanbanCanonDao.getOne(args);
  }

  async getMany(): Promise<KanbanCanon[]> {
    return this.kanbanCanonDao.getMany();
  }

  async addOne(input: KanbanCanonServiceAddOneInput): Promise<KanbanCanon> {
    const newKanbanCanonId = await this.kanbanCanonDao.addOne(input);
    return this.kanbanCanonDao.getOne({ id: newKanbanCanonId });
  }

  async editOne(id: string, input: KanbanCanonServiceEditOneInput): Promise<KanbanCanon> {
    return this.kanbanCanonDao.editOne(id, input);
  }

  // for existing cards
  async updateCardPositions(
    id: string,
    input: KanbanCanonServiceUpdateCardPositionsInput,
  ): Promise<KanbanCardPositions> {
    return this.kanbanCanonDao.updateCardPositions(id, input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanCanonDao.deleteOne(id);
  }
}
