import MeetRegistration from "../types/MeetRegistration";

export interface MeetRegistrationDaoAddOneArgs {
  userId: string;
  meetId: string;
}

export default interface MeetRegistrationDao {
  addOne(args: MeetRegistrationDaoAddOneArgs): Promise<MeetRegistration>;
}
