import { BadgeServiceAddOneInput, BadgeServiceGetManyArgs, BadgeServiceGetOneArgs } from "../service/BadgeService";
import { Badge } from "../types/gqlGeneratedTypes";

export default interface BadgeDao {
  getMany(args: BadgeServiceGetManyArgs): Promise<Badge[]>;
  getOne(args: BadgeServiceGetOneArgs): Promise<Badge>;
  addOne(input: BadgeServiceAddOneInput): Promise<Badge>;
}
