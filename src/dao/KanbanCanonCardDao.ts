import {
  KanbanCanonCardServiceAddOneInput,
  KanbanCanonCardServiceEditOneInput,
  KanbanCanonCardServiceGetManyArgs,
  KanbanCanonCardServiceGetOneArgs,
} from "../service/KanbanCanonCardService";
import { KanbanCanonCard } from "../types/gqlGeneratedTypes";

export default interface KanbanCanonCardDao {
  getOne(args: KanbanCanonCardServiceGetOneArgs): Promise<KanbanCanonCard>;
  getMany(args: KanbanCanonCardServiceGetManyArgs): Promise<KanbanCanonCard[]>;
  addOne(input: KanbanCanonCardServiceAddOneInput): Promise<KanbanCanonCard>;
  editOne(id: string, input: KanbanCanonCardServiceEditOneInput): Promise<KanbanCanonCard>;
  deleteOne(id: string): Promise<boolean>;
  // Testing methods for TestManager to call
  addMany(kanbanCanonCards: KanbanCanonCard[]): Promise<void>;
  deleteAll(): Promise<void>;
}
