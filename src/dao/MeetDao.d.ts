import { Meet } from "../types/gqlGeneratedTypes";
import { MeetServiceAddOneArgs, MeetServiceGetManyArgs } from "../service/MeetService";

export default interface MeetDao {
  getMany(args: MeetServiceGetManyArgs): Promise<Meet[]>;
  addOne(args: MeetServiceAddOneArgs): Promise<Meet>;
  deleteAll(): Promise<void>;
  addMany(meets: Meet[]): Promise<void>;
}
