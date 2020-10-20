import KanbanSessionDao from "../dao/KanbanSessionDao";
import {
  CreateKanbanSessionInput,
  KanbanSession,
  QueryKanbanSessionArgs,
  QueryKanbanSessionsArgs,
} from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface KanbanSessionServiceGetOneArgs extends QueryKanbanSessionArgs {}

export interface KanbanSessionServiceGetManyArgs extends QueryKanbanSessionsArgs {}

export interface KanbanSessionServiceAddOneInput extends CreateKanbanSessionInput {
  userId: string;
}

// export interface KanbanSessionServiceEditOneInput extends EditKanbanSessionInput {}

export default class KanbanSessionService implements EntityService<KanbanSession> {
  constructor(private kanbanSessionDao: KanbanSessionDao) {}

  async getOne(args: KanbanSessionServiceGetOneArgs): Promise<KanbanSession> {
    return this.kanbanSessionDao.getOne(args);
  }

  async getMany(args: KanbanSessionServiceGetManyArgs): Promise<KanbanSession[]> {
    return this.kanbanSessionDao.getMany(args);
  }

  async addOne(input: KanbanSessionServiceAddOneInput): Promise<KanbanSession> {
    return this.kanbanSessionDao.addOne(input);
  }

  // async editOne(id: string, input: KanbanSessionServiceEditOneInput): Promise<KanbanSession> {
  //   return this.kanbanSessionDao.editOne(id, input);
  // }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanSessionDao.deleteOne(id);
  }
}
