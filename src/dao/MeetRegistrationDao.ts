import MeetRegistration from "../types/MeetRegistration";
import { User } from "../types/User";

export interface MeetRegistrationDaoAddOneArgs {
  userId: string;
  meetId: string;
}

export default interface MeetRegistrationDao {
  addOne(args: MeetRegistrationDaoAddOneArgs): Promise<MeetRegistration>;
}
