import KanbanCanonCardDao, {
  KanbanCanonCardDaoAddOneInput,
  KanbanCanonCardDaoEditOneInput,
  KanbanCanonCardDaoGetOneArgs,
} from "../dao/KanbanCanonCardDao";
import KanbanCanonDao from "../dao/KanbanCanonDao";
import { KanbanCanonCard, KanbanCanonCardStatusEnum } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface KanbanCanonCardServiceAddOneInput extends KanbanCanonCardDaoAddOneInput {
  status?: KanbanCanonCardStatusEnum | null;
  index?: number | null;
}
export interface KanbanCanonCardServiceEditOneInput extends KanbanCanonCardDaoEditOneInput {
  status?: KanbanCanonCardStatusEnum | null;
  index?: number | null;
}

const mapServiceAddOneInputToDaoAddOneInput = ({
  title,
  body,
  kanbanCanonId,
}: KanbanCanonCardServiceAddOneInput): KanbanCanonCardDaoAddOneInput => ({ title, body, kanbanCanonId });
const mapServiceEditOneInputToDaoEditOneInput = ({
  title,
  body,
}: KanbanCanonCardServiceEditOneInput): KanbanCanonCardDaoEditOneInput => ({ title, body });

export default class KanbanCanonCardService implements EntityService<KanbanCanonCard> {
  constructor(private kanbanCanonCardDao: KanbanCanonCardDao, private kanbanCanonDao: KanbanCanonDao) {}
  async getOne(args: KanbanCanonCardDaoGetOneArgs): Promise<KanbanCanonCard> {
    return this.kanbanCanonCardDao.getOne(args);
  }

  async addOne(input: KanbanCanonCardServiceAddOneInput): Promise<KanbanCanonCard> {
    // create card
    const mappedInput = mapServiceAddOneInputToDaoAddOneInput(input);
    const newKanbanCanonCard = await this.kanbanCanonCardDao.addOne(mappedInput);
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
    const mappedInput = mapServiceEditOneInputToDaoEditOneInput(input);
    const updatedKanbanCanonCard = await this.kanbanCanonCardDao.editOne(id, mappedInput);
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
    const kanbanCanonCard = await this.kanbanCanonCardDao.getOne({ id });
    // must sync kanbanCanon.cardPositions array to reflect deletion
    await this.kanbanCanonDao.deleteCardFromPosition(kanbanCanonCard.kanbanCanonId, { kanbanCanonCardId: id });
    return this.kanbanCanonCardDao.deleteOne(id);
  }
}
