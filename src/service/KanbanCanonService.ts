import KanbanCanonDao from "../dao/KanbanCanonDao";
import { KanbanCanon } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

// Only allow ID lookup for now
export interface KanbanCanonServiceGetOneArgs {
  id: string;
}

export interface KanbanCanonServiceAddOneInput {
  title: string;
  description: string;
}
export interface KanbanCanonServiceEditOneInput {
  title?: string | null;
  description?: string | null;
}

export default class KanbanCanonService implements EntityService<KanbanCanon> {
  constructor(private kanbanCanonDao: KanbanCanonDao) {}
  async getOne(args: KanbanCanonServiceGetOneArgs): Promise<KanbanCanon> {
    return this.kanbanCanonDao.getOne(args);
  }

  async getMany(): Promise<KanbanCanon[]> {
    return this.kanbanCanonDao.getMany();
  }

  //   async addOne(input: KanbanCanonServiceAddOneInput): Promise<KanbanCanon> {
  //     return this.kanbanCanonDao.addOne(input);
  //   }

  //   async editOne(id: string, input: KanbanCanonServiceEditOneInput): Promise<KanbanCanon> {
  //     return this.kanbanCanonDao.editOne(id, input);
  //   }

  //   async deleteOne(id: string): Promise<boolean> {
  //     return this.kanbanCanonDao.deleteOne(id);
  //   }
}
