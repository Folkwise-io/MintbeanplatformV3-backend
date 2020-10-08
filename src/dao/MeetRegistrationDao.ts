import { MeetRegistrationServiceAddOneArgs } from "../service/MeetRegistrationService";
import MeetRegistration from "../types/MeetRegistration";

export default interface MeetRegistrationDao {
  addOne(args: MeetRegistrationServiceAddOneArgs): Promise<MeetRegistration>;
  deleteOne(id: string): Promise<boolean>;
  addMany(meetRegistrations: MeetRegistration[]): Promise<void>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(meetRegistrations: MeetRegistration[]): Promise<void>;
}
