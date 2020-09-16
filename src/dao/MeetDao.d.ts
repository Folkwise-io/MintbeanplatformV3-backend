import { Meet } from "../types/gqlGeneratedTypes";
import { MeetServiceGetManyArgs } from "../service/MeetService";

export default interface MeetDao {
  getMany(args: MeetServiceGetManyArgs): Promise<Meet[]>;
  deleteAll(): Promise<void>;
  addMany(meets: Meet[]): Promise<void>;
}
