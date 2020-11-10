import KanbanDao from "../dao/KanbanDao";
import {
  CreateKanbanInput,
  Kanban,
  KanbanCardPositions,
  QueryKanbanArgs,
  QueryKanbansArgs,
} from "../types/gqlGeneratedTypes";
import { KanbanCanonServiceUpdateCardPositionsInput } from "./KanbanCanonService";

export interface KanbanServiceGetOneArgs extends QueryKanbanArgs {}
export interface KanbanServiceGetManyArgs extends QueryKanbansArgs {}
export interface KanbanServiceAddOneInput extends CreateKanbanInput {}

export default class KanbanService {
  constructor(private kanbanDao: KanbanDao) {}
  async getOne(args: KanbanServiceGetOneArgs): Promise<Kanban | undefined> {
    return this.kanbanDao.getOne(args);
  }

  async getMany(args: KanbanServiceGetManyArgs): Promise<Kanban[]> {
    return this.kanbanDao.getMany(args);
  }

  async addOne(input: KanbanServiceAddOneInput): Promise<Kanban> {
    await this.kanbanDao.addOne(input);
    return (this.kanbanDao.getOne({ ...input }) as unknown) as Kanban;
  }

  async updateCardPositions(
    id: string,
    input: KanbanCanonServiceUpdateCardPositionsInput,
  ): Promise<KanbanCardPositions> {
    return this.kanbanDao.updateCardPositions(id, input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanDao.deleteOne(id);
  }
}
