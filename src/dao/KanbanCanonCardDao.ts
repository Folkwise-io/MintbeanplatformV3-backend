import {
  KanbanCanonCardServiceAddOneInput,
  KanbanCanonCardServiceEditOneInput,
  KanbanCanonCardServiceGetManyArgs,
  KanbanCanonCardServiceGetOneArgs,
} from "../service/KanbanCanonCardService";
import { KanbanCanonCard } from "../types/gqlGeneratedTypes";

export type KanbanCanonCardDaoAddOneInput = Omit<KanbanCanonCardServiceAddOneInput, "status" | "index">;
export type KanbanCanonCardDaoEditOneInput = Omit<KanbanCanonCardServiceEditOneInput, "status" | "index">;

export default interface KanbanCanonCardDao {
  getOne(args: KanbanCanonCardServiceGetOneArgs): Promise<KanbanCanonCard>;
  getMany(args: KanbanCanonCardServiceGetManyArgs): Promise<KanbanCanonCard[]>;
  addOne(input: KanbanCanonCardDaoAddOneInput): Promise<KanbanCanonCard>;
  editOne(id: string, input: KanbanCanonCardDaoEditOneInput): Promise<KanbanCanonCard>;
  deleteOne(id: string): Promise<boolean>;
  // Testing methods for TestManager to call
  addMany(kanbanCanonCards: KanbanCanonCard[]): Promise<void>;
  deleteAll(): Promise<void>;
}
