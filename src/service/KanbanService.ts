import KanbanDao, { KanbanDaoAddOneInput } from "../dao/KanbanDao";
import { Kanban } from "../types/gqlGeneratedTypes";

export default class KanbanService {
  constructor(private kanbanDao: KanbanDao) {}

  async addOne(input: KanbanDaoAddOneInput): Promise<Kanban> {
    await this.kanbanDao.addOne(input);
    return (this.kanbanDao.getOne({ ...input }) as unknown) as Kanban;
  }
}
