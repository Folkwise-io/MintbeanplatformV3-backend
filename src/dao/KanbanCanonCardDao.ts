import { KanbanCanonCardServiceGetManyArgs, KanbanCanonCardServiceGetOneArgs } from "../service/KanbanCanonCardService";
import { KanbanCanonCard } from "../types/gqlGeneratedTypes";

export default interface KanbanCanonCardDao {
  getOne(args: KanbanCanonCardServiceGetOneArgs): Promise<KanbanCanonCard>;
  getMany(args: KanbanCanonCardServiceGetManyArgs): Promise<KanbanCanonCard[]>;
  //   addOne(args: KanbanCanonCardServiceAddOneArgs): Promise<KanbanCanonCard>;
  // Testing methods for TestManager to call
  addMany(users: KanbanCanonCard[]): Promise<void>;
  deleteAll(): Promise<void>;
}
