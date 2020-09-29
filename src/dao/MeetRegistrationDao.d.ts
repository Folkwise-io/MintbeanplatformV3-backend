import MeetRegistration from "../types/meetRegistration";

export default interface MeetRegistrationDao {
  getOne(args: UserServiceGetOneArgs): Promise<MeetRegistration>;
  getMany(args: MeetRegistrationServiceGetManyArgs): Promise<MeetRegistration[]>;
  addOne(args: MeetRegistrationServiceAddOneInput): Promise<MeetRegistration>;
  editOne(id: string, input: MeetRegistrationServiceEditOneInput): Promise<MeetRegistration>;
  deleteOne(id: string): Promise<boolean>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(meetRegistrations: MeetRegistration[]): Promise<void>;
}
