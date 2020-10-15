import { KanbanSession } from "../types/gqlGeneratedTypes";
import {
  KanbanSessionServiceAddOneInput,
  KanbanSessionServiceEditOneInput,
  KanbanSessionServiceGetManyArgs,
  KanbanSessionServiceGetOneArgs,
} from "../service/KanbanSessionService";
import { KanbanSessionRaw } from "./KanbanSessionDaoKnex";

export default interface KanbanDao {
  getOne(args: KanbanSessionServiceGetOneArgs): Promise<KanbanSession>;
  getMany(args: KanbanSessionServiceGetManyArgs): Promise<KanbanSession[]>;
  addOne(args: KanbanSessionServiceAddOneInput): Promise<KanbanSession>;
  editOne(id: string, input: KanbanSessionServiceEditOneInput): Promise<KanbanSession>;
  deleteOne(id: string): Promise<boolean>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(kanbans: KanbanSessionRaw[]): Promise<void>;
}
