import { KanbanSessionCard } from "../types/gqlGeneratedTypes";
import {
  KanbanSessionCardServiceAddOneInput,
  KanbanSessionCardServiceEditOneInput,
  KanbanSessionCardServiceGetOneArgs,
  KanbanSessionCardServiceGetManyArgs,
} from "../service/KanbanSessionCardService";
import { KanbanSessionCardAddManyInput, KanbanSessionCardRaw } from "./KanbanSessionCardDaoKnex";

export default interface KanbanSessionCardDao {
  getOne(args: KanbanSessionCardServiceGetOneArgs): Promise<KanbanSessionCard>;
  getMany(args: KanbanSessionCardServiceGetManyArgs): Promise<KanbanSessionCard[]>;
  addOne(args: KanbanSessionCardServiceAddOneInput): Promise<KanbanSessionCard>;
  editOne(id: string, input: KanbanSessionCardServiceEditOneInput): Promise<KanbanSessionCard>;
  deleteOne(id: string): Promise<boolean>;
  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(kanbanCards: KanbanSessionCardRaw[] | KanbanSessionCardAddManyInput[]): Promise<void>;
}
