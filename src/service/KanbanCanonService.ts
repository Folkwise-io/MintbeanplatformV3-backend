import KanbanCanonDao, { KanbanCanonDaoAddOneInput } from "../dao/KanbanCanonDao";
import { KanbanCanon } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export default class KanbanCanonService implements EntityService<KanbanCanon> {
  constructor(private kanbanCanonDao: KanbanCanonDao) {}

  async addOne(input: KanbanCanonDaoAddOneInput): Promise<KanbanCanon> {
    const newKanbanCanonId = await this.kanbanCanonDao.addOne(input);
    return this.kanbanCanonDao.getOne({ id: newKanbanCanonId });
  }
}
