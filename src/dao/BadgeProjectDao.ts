import BadgeProject from "../types/badgeProject";
import { MutationAwardBadgesArgs } from "../types/gqlGeneratedTypes";

export default interface BadgeProjectDao {
  addOne(badgesProject: MutationAwardBadgesArgs): Promise<BadgeProject>;
}
