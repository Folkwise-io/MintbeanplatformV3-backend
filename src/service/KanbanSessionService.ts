import KanbanCardDao from "../dao/KanbanCardDao";
import KanbanSessionCardDao from "../dao/KanbanSessionCardDao";
import KanbanSessionDao from "../dao/KanbanSessionDao";
import {
  CreateKanbanSessionInput,
  KanbanSession,
  QueryKanbanSessionArgs,
  QueryKanbanSessionsArgs,
} from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export interface KanbanSessionServiceGetOneArgs extends QueryKanbanSessionArgs {}

export interface KanbanSessionServiceGetManyArgs extends QueryKanbanSessionsArgs {}

export interface KanbanSessionServiceAddOneInput extends CreateKanbanSessionInput {
  userId: string;
}

export interface KanbanSessionServiceCheckForNewKanbanCardsArgs {
  kanbanSessionId: string;
  kanbanId: string;
}

export interface KanbanSessionServiceSyncNewKanbanCardsArgs {
  kanbanSessionId: string;
  orphanedCardIds: string[];
}

// export interface KanbanSessionServiceEditOneInput extends EditKanbanSessionInput {}

export default class KanbanSessionService implements EntityService<KanbanSession | null> {
  constructor(
    private kanbanSessionDao: KanbanSessionDao,
    private kanbanCardDao: KanbanCardDao,
    private kanbanSessionCardDao: KanbanSessionCardDao,
  ) {}

  // This can probably be done more elegantly. Currently touches db up to 5 times for one execution if kanbanCards are out of sync with kanbanSessionCards
  async getOne(args: KanbanSessionServiceGetOneArgs): Promise<KanbanSession | null> {
    // get kanbanSession so we know kanbanId
    const kanbanSession = await this.kanbanSessionDao.getOne(args);
    if (!kanbanSession) return null;

    // check to see if kanbanSessionCard sync is necessary
    const orphanedCardIds = await this.getOrphanedCardIds({
      kanbanSessionId: kanbanSession.id,
      kanbanId: kanbanSession.kanbanId,
    });

    // create new kanbanSessionCards if necessary
    if (orphanedCardIds.length) {
      await this.syncNewKanbanCards({ kanbanSessionId: kanbanSession.id, orphanedCardIds });
    }
    return kanbanSession;
  }

  async getMany(args: KanbanSessionServiceGetManyArgs): Promise<KanbanSession[]> {
    return this.kanbanSessionDao.getMany(args);
  }

  // Finds and returns array ids of kanbanCards that do not yet have a corresponding kanbanSessionCard
  private async getOrphanedCardIds(args: KanbanSessionServiceCheckForNewKanbanCardsArgs): Promise<string[]> {
    const kanbanCards = await this.kanbanCardDao.getMany({ kanbanId: args.kanbanId });
    const kanbanCardIds: string[] = kanbanCards.map((kbc) => kbc.id);
    const kanbanSessionCards = await this.kanbanSessionCardDao.getMany({ kanbanSessionId: args.kanbanSessionId });
    const kanbanSessionCardKanbanCardIds: string[] = kanbanSessionCards.map((kbsc) => kbsc.kanbanCardId);

    const orphanedCardIds = kanbanCardIds.filter((kbcid) => !kanbanSessionCardKanbanCardIds.includes(kbcid));
    return orphanedCardIds;
  }

  // Add missing kanbanSessionCards to mirror kanbanCards
  private async syncNewKanbanCards({
    kanbanSessionId,
    orphanedCardIds,
  }: KanbanSessionServiceSyncNewKanbanCardsArgs): Promise<void> {
    const newKanbanCardsInput = orphanedCardIds.map((kanbanCardId) => ({
      kanbanSessionId,
      kanbanCardId,
    }));

    await this.kanbanSessionCardDao.addMany(newKanbanCardsInput);
  }

  async addOne(input: KanbanSessionServiceAddOneInput): Promise<KanbanSession> {
    return this.kanbanSessionDao.addOne(input);
  }

  // async editOne(id: string, input: KanbanSessionServiceEditOneInput): Promise<KanbanSession> {
  //   return this.kanbanSessionDao.editOne(id, input);
  // }

  async deleteOne(id: string): Promise<boolean> {
    return this.kanbanSessionDao.deleteOne(id);
  }
}
