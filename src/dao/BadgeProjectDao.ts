import { MutationAwardBadgesArgs } from "../types/gqlGeneratedTypes";

export default interface BadgeProjectDao {
  addMany(badgesProject: MutationAwardBadgesArgs): Promise<void>;
  // Below are TestManager methods
  deleteAll(): Promise<void>;
}
