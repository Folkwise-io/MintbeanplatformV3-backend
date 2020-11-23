import BadgeProject from "../types/badgeProject";
import { MutationAwardBadgesArgs } from "../types/gqlGeneratedTypes";

export default interface BadgeProjectDao {
  addOne(badgesProject: MutationAwardBadgesArgs): Promise<BadgeProject>;
  // Below are TestManager methods
  addMany(badgesProject: MutationAwardBadgesArgs[]): Promise<BadgeProject[]>;
  deleteAll(): Promise<void>;
}
