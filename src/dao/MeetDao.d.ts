import { Meet } from "../types/gqlGeneratedTypes";
import { MeetServiceAddOneInput, MeetServiceEditOneInput, MeetServiceGetManyArgs } from "../service/MeetService";

export default interface MeetDao {
  getOne(args: UserServiceGetOneArgs): Promise<Meet>;
  getMany(args: MeetServiceGetManyArgs): Promise<Meet[]>;
  addOne(args: MeetServiceAddOneInput): Promise<Meet>;
  editOne(id: string, input: MeetServiceEditOneInput): Promise<Meet>;
  deleteOne(id: string): Promise<boolean>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(meets: Meet[]): Promise<void>;
}
