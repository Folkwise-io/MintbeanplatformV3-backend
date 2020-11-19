import { Meet } from "../types/gqlGeneratedTypes";
import {
  MeetServiceAddOneInput,
  MeetServiceEditOneInput,
  MeetServiceGetManyArgs,
  MeetServiceGetOneArgs,
} from "../service/MeetService";

export default interface MeetDao {
  getOne(args: MeetServiceGetOneArgs): Promise<Meet | undefined>;
  getMany(args: MeetServiceGetManyArgs): Promise<Meet[]>;
  addOne(args: MeetServiceAddOneInput): Promise<Meet>;
  editOne(id: string, input: MeetServiceEditOneInput): Promise<Meet>;
  deleteOne(id: string): Promise<boolean>;
}
