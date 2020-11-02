import KanbanDao from "../dao/KanbanDao";
import { CreateKanbanInput, Kanban, QueryKanbanArgs, QueryKanbansArgs } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface KanbanServiceGetOneArgs extends QueryKanbanArgs {}
export interface KanbanServiceGetManyArgs extends QueryKanbansArgs {}
export interface KanbanServiceAddOneInput extends CreateKanbanInput {}

export default class KanbanService implements EntityService<Kanban> {
  constructor(private kanbanDao: KanbanDao) {}
  async getOne(args: KanbanServiceGetOneArgs): Promise<Kanban> {
    return this.kanbanDao.getOne(args);
  }

  async getMany(args: KanbanServiceGetManyArgs): Promise<Kanban[]> {
    return this.kanbanDao.getMany(args);
  }

  async addOne(input: KanbanServiceAddOneInput): Promise<Kanban> {
    return this.kanbanDao.addOne(input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanDao.deleteOne(id);
  }
}
