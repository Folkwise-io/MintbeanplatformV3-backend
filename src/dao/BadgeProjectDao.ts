import BadgeProject from "../types/badgeProject";
import { MutationAwardBadgesToProjectArgs } from "../types/gqlGeneratedTypes";

export default interface BadgeProjectDao {
  addOne(badgesProject: MutationAwardBadgesToProjectArgs): Promise<BadgeProject>;
}
