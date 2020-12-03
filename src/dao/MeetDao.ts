import { Meet, MeetType } from "../types/gqlGeneratedTypes";

// Only allow ID lookup for now
export interface MeetDaoGetOneArgs {
  id: string;
}

export interface MeetDaoGetManyArgs {
  // TODO: Add search query args to Meets here
  registrantId?: string;
}

export interface MeetDaoAddOneInput {
  meetType: MeetType;
  title: string;
  description: string;
  instructions: string;
  registerLink?: string | null;
  coverImageUrl: string;
  startTime: string;
  endTime: string;
  region: string;
}

export interface MeetDaoEditOneInput {
  meetType?: MeetType | null;
  title?: string | null;
  description?: string | null;
  instructions?: string | null;
  registerLink?: string | null;
  coverImageUrl?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  region?: string | null;
}

export default interface MeetDao {
  getOne(args: MeetDaoGetOneArgs): Promise<Meet | undefined>;
  getMany(args: MeetDaoGetManyArgs): Promise<Meet[]>;
  addOne(args: MeetDaoAddOneInput): Promise<Meet>;
  editOne(id: string, input: MeetDaoEditOneInput): Promise<Meet>;
  deleteOne(id: string): Promise<boolean>;
}
