import { KanbanCanonDaoUpdateCardPositionsInput } from "../dao/KanbanCanonDao";
import KanbanDao, { KanbanDaoAddOneInput, KanbanDaoGetManyArgs, KanbanDaoGetOneArgs } from "../dao/KanbanDao";
import { Kanban, KanbanCardPositions } from "../types/gqlGeneratedTypes";

export default class KanbanService {
  constructor(private kanbanDao: KanbanDao) {}
  async getOne(args: KanbanDaoGetOneArgs): Promise<Kanban | undefined> {
    return this.kanbanDao.getOne(args);
  }

  async getMany(args: KanbanDaoGetManyArgs): Promise<Kanban[]> {
    return this.kanbanDao.getMany(args);
  }

  async addOne(input: KanbanDaoAddOneInput): Promise<Kanban> {
    await this.kanbanDao.addOne(input);
    return (this.kanbanDao.getOne({ ...input }) as unknown) as Kanban;
  }

  async updateCardPositions(id: string, input: KanbanCanonDaoUpdateCardPositionsInput): Promise<KanbanCardPositions> {
    return this.kanbanDao.updateCardPositions(id, input);
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanDao.deleteOne(id);
  }
}
