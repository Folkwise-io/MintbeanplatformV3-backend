import KanbanSessionDao from "../dao/KanbanSessionDao";
import { KanbanSession } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface KanbanSessionServiceGetOneArgs {
  id?: string;
  kanbanId?: string;
  userId?: string;
  meetId?: string;
}

export interface KanbanSessionServiceGetManyArgs {
  kanbanId?: string;
  userId?: string;
  meetId?: string;
}

export interface KanbanSessionServiceAddOneInput {
  kanbanId: string;
  userId: string;
  meetId?: string;
}

export interface KanbanSessionServiceEditOneInput {
  kanbanId?: string | null;
  userId?: string | null;
  meetId?: string | null;
}

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

  async editOne(id: string, input: KanbanSessionServiceEditOneInput): Promise<KanbanSession> {
    return this.kanbanSessionDao.editOne(id, input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanSessionDao.deleteOne(id);
  }
}
