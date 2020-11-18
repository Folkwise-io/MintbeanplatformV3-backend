import KanbanCanonDao from "../../../src/dao/KanbanCanonDao";
import { KanbanCardPositions } from "../../../src/types/gqlGeneratedTypes";

export interface KanbanCanonRaw {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  cardPositions?: KanbanCardPositions;
}

export default interface TestKanbanCanonDao extends KanbanCanonDao {
  addMany(kanbanCanons: KanbanCanonRaw[]): Promise<void>;
  deleteAll(): Promise<void>;
}
