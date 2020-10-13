import KanbanSessionCardDao from "../dao/KanbanSessionCardDao";
import { KanbanSessionCard } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

// Only allow ID lookup for now
export interface KanbanSessionCardServiceGetOneArgs {
  id: string;
}
export interface KanbanSessionCardServiceGetManyArgs {
  kanbanSessionId: string;
}

// to Enum?
export type KanbanSessionCardStatuses = "TODO" | "WIP" | "DONE";

export interface KanbanSessionCardServiceAddOneInput {
  kanbanSessionId: string;
  kanbanCardId: string;
  index: number;
  status: KanbanSessionCardStatuses;
}

export interface KanbanSessionCardServiceEditOneInput {
  kanbanSessionId?: string | null;
  kanbanCardId?: string | null;
  index?: number | null;
  status?: KanbanSessionCardStatuses | null;
}

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
