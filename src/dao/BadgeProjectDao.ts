import BadgeProject from "../types/badgeProject";
import { Badge, MutationAwardBadgesToProjectArgs } from "../types/gqlGeneratedTypes";

export interface BadgeProjectDaoGetManyArgs {
  projectId: string;
}

export default interface BadgeProjectDao {
  syncBadges(badgesProject: MutationAwardBadgesToProjectArgs): Promise<void>;
  getMany(args: BadgeProjectDaoGetManyArgs): Promise<Badge[]>;
}
