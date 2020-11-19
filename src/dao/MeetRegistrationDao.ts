import { MeetRegistrationServiceAddOneArgs } from "../service/MeetRegistrationService";
import MeetRegistration from "../types/MeetRegistration";

export default interface MeetRegistrationDao {
  addOne(args: MeetRegistrationServiceAddOneArgs): Promise<MeetRegistration>;
  deleteOne(id: string): Promise<boolean>;
}
