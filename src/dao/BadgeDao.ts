import { BadgeServiceAddOneInput, BadgeServiceEditOneInput, BadgeServiceGetManyArgs } from "../service/BadgeService";
import { Badge, QueryBadgeArgs } from "../types/gqlGeneratedTypes";

export default interface BadgeDao {
  getMany(args: BadgeServiceGetManyArgs): Promise<Badge[]>;
  getOne(args: QueryBadgeArgs): Promise<Badge>;
  addOne(input: BadgeServiceAddOneInput): Promise<Badge>;
  editOne(id: string, input: BadgeServiceEditOneInput): Promise<Badge>;
  deleteOne(id: string): Promise<boolean>;
}
