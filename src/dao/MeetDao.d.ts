import { Meet } from "../types/gqlGeneratedTypes";
import { MeetServiceAddOneInput, MeetServiceEditOneInput, MeetServiceGetManyArgs } from "../service/MeetService";

export default interface MeetDao {
  getMany(args: MeetServiceGetManyArgs): Promise<Meet[]>;
  addOne(args: MeetServiceAddOneInput): Promise<Meet>;
  editOne(id: string, input: MeetServiceEditOneInput): Promise<Meet>;
  deleteAll(): Promise<void>;
  addMany(meets: Meet[]): Promise<void>;
}
