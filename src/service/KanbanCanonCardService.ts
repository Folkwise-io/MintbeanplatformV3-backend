import KanbanCanonCardDao from "../dao/KanbanCanonCardDao";
import KanbanCanonDao from "../dao/KanbanCanonDao";
import {
  CreateKanbanCanonCardInput,
  EditKanbanCanonCardInput,
  KanbanCanonCard,
  KanbanCanonCardStatusEnum,
  QueryKanbanCanonCardArgs,
  QueryKanbanCanonCardsArgs,
} from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface KanbanCanonCardServiceGetOneArgs extends QueryKanbanCanonCardArgs {}
export interface KanbanCanonCardServiceGetManyArgs extends QueryKanbanCanonCardsArgs {}
export interface KanbanCanonCardServiceAddOneInput extends CreateKanbanCanonCardInput {}
export interface KanbanCanonCardServiceEditOneInput extends EditKanbanCanonCardInput {}

export default class KanbanCanonCardService implements EntityService<KanbanCanonCard> {
  constructor(private kanbanCanonCardDao: KanbanCanonCardDao, private kanbanCanonDao: KanbanCanonDao) {}
  async getOne(args: KanbanCanonCardServiceGetOneArgs): Promise<KanbanCanonCard> {
    return this.kanbanCanonCardDao.getOne(args);
  }

  async getMany(args: KanbanCanonCardServiceGetManyArgs): Promise<KanbanCanonCard[]> {
    return this.kanbanCanonCardDao.getMany(args);
  }

  async addOne(input: KanbanCanonCardServiceAddOneInput): Promise<KanbanCanonCard> {
    // create card
    const newKanbanCanonCard = await this.kanbanCanonCardDao.addOne(input);
    // update card positions object on kanbanCanon
    const { status, index } = input;
    const { kanbanCanonId } = input;
    await this.kanbanCanonDao.insertNewCardPosition(kanbanCanonId, {
      cardId: newKanbanCanonCard.id,
      status: status || KanbanCanonCardStatusEnum.Todo,
      index: index || 0,
    });
    return newKanbanCanonCard;
  }

  async editOne(id: string, input: KanbanCanonCardServiceEditOneInput): Promise<KanbanCanonCard> {
    // edit card
    const updatedKanbanCanonCard = await this.kanbanCanonCardDao.editOne(id, input);
    // update position if necessary
    const { index, status } = input;
    const indexIsUndefined = typeof index === "undefined";
    if (status || !indexIsUndefined) {
      await this.kanbanCanonDao.updateCardPositions(updatedKanbanCanonCard.kanbanCanonId, {
        cardId: id,
        status: status || KanbanCanonCardStatusEnum.Todo,
        index: index || 0,
      });
    }
    return updatedKanbanCanonCard;
  }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanCanonCardDao.deleteOne(id);
  }
}
