import { Meet } from "../types/gqlGeneratedTypes";

export default interface MeetDao {
  deleteAll(): Promise<void>;
  addMany(meets: Meet[]): Promise<void>;
}
