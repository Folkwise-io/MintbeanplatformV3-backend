import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import KanbanDao from "./KanbanDao";
import { Kanban, KanbanCardPositions } from "../types/gqlGeneratedTypes";
import { KanbanDaoGetOneArgs, KanbanDaoGetManyArgs, KanbanDaoAddOneInput } from "./KanbanDao";
import { prefixKeys } from "../util/prefixKeys";
import { resolve, updateCardPositions } from "./util/cardPositionUtils";
import { ensureExists } from "../util/ensureExists";
import { KanbanCanonDaoUpdateCardPositionsInput } from "./KanbanCanonDao";

interface KanbanRawData extends Kanban {
  kanbanCanonCardPositions: KanbanCardPositions;
  kanbanSessionCardPositions: KanbanCardPositions;
}

// omits kanbanCanonCardPositions and kanbanSessionCardPositions from KanbanRawData
const mapDraftKanbanToKanban = (draftKanban: KanbanRawData): Kanban => {
  const kanban: Kanban & {
    kanbanCanonCardPositions?: KanbanCardPositions;
    kanbanSessionCardPositions?: KanbanCardPositions;
  } = { ...draftKanban };
  delete kanban.kanbanCanonCardPositions;
  delete kanban.kanbanSessionCardPositions;
  return kanban as Kanban;
};

// take the draftKanban canon and session card status and resolve to the statuses the end user should see
const rawToKanban = (draftKanban: KanbanRawData): Kanban => {
  const { kanbanCanonCardPositions, kanbanSessionCardPositions } = draftKanban;
  const cardPositions: KanbanCardPositions = resolve(kanbanCanonCardPositions, kanbanSessionCardPositions);
  // filter the draftKanban kanban data and add the resolved cardPositions
  return { ...mapDraftKanbanToKanban(draftKanban), cardPositions } as Kanban;
};

// TODO: Refactor repeated query
export default class KanbanDaoKnex implements KanbanDao {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  // Reusable kanban query for getOne/getMany methods
  _getManyQuery(whereArgs: KanbanDaoGetOneArgs | KanbanDaoGetManyArgs) {
    return this.knex
      .from("kanbanSessions")
      .innerJoin("kanbanCanons", "kanbanSessions.kanbanCanonId", "kanbanCanons.id")
      .select(
        { id: "kanbanSessions.id" },
        { kanbanCanonId: "kanbanSessions.kanbanCanonId" },
        { userId: "kanbanSessions.userId" },
        { meetId: "kanbanSessions.meetId" },
        { title: "kanbanCanons.title" },
        { description: "kanbanCanons.description" },
        { createdAt: "kanbanSessions.createdAt" },
        { updatedAt: "kanbanSessions.updatedAt" },
        { kanbanSessionCardPositions: "kanbanSessions.cardPositions" },
        { kanbanCanonCardPositions: "kanbanCanons.cardPositions" },
      )
      .where(prefixKeys("kanbanSessions", { ...whereArgs, deleted: false }));
  }

  async getOne(args: KanbanDaoGetOneArgs): Promise<Kanban | undefined> {
    return handleDatabaseError(async () => {
      const kanbanRawData: KanbanRawData = await this._getManyQuery(args).first();

      // resolve kanban card status positions the end user should see
      if (!kanbanRawData) return undefined; // undefined is valid return type in some cases. ex: user queries a meet with kanbanCanon and they don't have a kanban on it yet

      const kanban = rawToKanban(kanbanRawData);
      return kanban;
    });
  }

  async getMany(args: KanbanDaoGetManyArgs): Promise<Kanban[]> {
    return handleDatabaseError(async () => {
      const kanbanRawData = ((await this._getManyQuery(args)) as unknown) as KanbanRawData[];

      // resolve kanban card status positions the end user should see
      const kanbans = kanbanRawData.map((raw) => rawToKanban(raw));

      return kanbans;
    });
  }

  async addOne(args: KanbanDaoAddOneInput): Promise<void> {
    return handleDatabaseError(async () => {
      await this.knex("kanbanSessions").insert(args);
      // Note: to get this newly created kanban, re-fetch using this.getOne() with the same args
    });
  }

  async updateCardPositions(id: string, input: KanbanCanonDaoUpdateCardPositionsInput): Promise<KanbanCardPositions> {
    return handleDatabaseError(async () => {
      // get old positions
      const { cardPositions: oldPositions } = ensureExists<Kanban>("Kanban")(await this.getOne({ id }));

      // calculate new positions
      const newPositions = updateCardPositions({ oldPositions, ...input });

      // update cardPositions in db
      await this.knex("kanbanSessions")
        .where({ id })
        .update({ cardPositions: newPositions, updatedAt: this.knex.fn.now() });

      return newPositions;
    });
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("kanbanSessions").where({ id }).update({ deleted: true });
      return true;
    });
  }
}
