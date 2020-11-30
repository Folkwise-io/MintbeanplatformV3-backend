import BadgeProject from "../types/badgeProject";
import { MutationAwardBadgesToProjectArgs } from "../types/gqlGeneratedTypes";

export default interface BadgeProjectDao {
  syncBadges(badgesProject: MutationAwardBadgesToProjectArgs): Promise<void>;
}
