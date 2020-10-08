import KanbanCardDao from "../dao/KanbanCardDao";
import { KanbanCard } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

// Only allow ID lookup for now
export interface KanbanCardServiceGetOneArgs {
  id: string;
}
export interface KanbanCardServiceGetManyArgs {
  kanbanId: string;
}

export interface KanbanCardServiceAddOneInput {
  kanbanId: string | null;
  title: string;
  body: string;
  index: number;
}

export interface KanbanCardServiceEditOneInput {
  kanbanId?: string | null;
  title?: string | null;
  body?: string | null;
  index?: number | null;
}

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
