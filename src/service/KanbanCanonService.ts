import KanbanCanonDao, {
  KanbanCanonDaoAddOneInput,
  KanbanCanonDaoEditOneInput,
  KanbanCanonDaoGetOneArgs,
  KanbanCanonDaoUpdateCardPositionsInput,
} from "../dao/KanbanCanonDao";
import { KanbanCanon, KanbanCardPositions } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export default class KanbanCanonService implements EntityService<KanbanCanon> {
  constructor(private kanbanCanonDao: KanbanCanonDao) {}
  async getOne(args: KanbanCanonDaoGetOneArgs): Promise<KanbanCanon> {
    return this.kanbanCanonDao.getOne(args);
  }

  async getMany(): Promise<KanbanCanon[]> {
    return this.kanbanCanonDao.getMany();
  }

  async addOne(input: KanbanCanonDaoAddOneInput): Promise<KanbanCanon> {
    const newKanbanCanonId = await this.kanbanCanonDao.addOne(input);
    return this.kanbanCanonDao.getOne({ id: newKanbanCanonId });
  }

  async editOne(id: string, input: KanbanCanonDaoEditOneInput): Promise<KanbanCanon> {
    return this.kanbanCanonDao.editOne(id, input);
  }

  // for existing cards
  async updateCardPositions(id: string, input: KanbanCanonDaoUpdateCardPositionsInput): Promise<KanbanCardPositions> {
    return this.kanbanCanonDao.updateCardPositions(id, input);
  }
}
