import {
  BadgeServiceAddOneInput,
  BadgeServiceEditOneInput,
  BadgeServiceGetManyArgs,
  BadgeServiceGetOneArgs,
} from "../service/BadgeService";
import { Badge } from "../types/gqlGeneratedTypes";

export default interface BadgeDao {
  getMany(args: BadgeServiceGetManyArgs): Promise<Badge[]>;
  getOne(args: BadgeServiceGetOneArgs): Promise<Badge>;
  addOne(input: BadgeServiceAddOneInput): Promise<Badge>;
  editOne(badgeId: string, input: BadgeServiceEditOneInput): Promise<Badge>;
  deleteOne(badgeId: string): Promise<boolean>;
}
