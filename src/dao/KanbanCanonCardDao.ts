import {
  KanbanCanonCardServiceAddOneInput,
  KanbanCanonCardServiceEditOneInput,
  KanbanCanonCardServiceGetManyArgs,
  KanbanCanonCardServiceGetOneArgs,
} from "../service/KanbanCanonCardService";
import { KanbanCanonCard } from "../types/gqlGeneratedTypes";

// The service layer needs status and index to orchestrate the update of card positions.
// status and index do not exist as columns on kanbanCanonCards and these keys are therefore omitted
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
