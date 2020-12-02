import { MediaAsset } from "../types/gqlGeneratedTypes";

export interface MediaAssetDaoAddOneArgs {
  userId: string;
  meetId?: string | null;
  cloudinaryPublicId: string;
  index?: number;
}

export type MediaAssetDaoAddManyArgs = Array<MediaAssetDaoAddOneArgs>;

export interface MediaAssetDaoGetManyArgs {
  // userId?: string | null;
  projectId?: string | null;
}

export default interface MediaAssetDao {
  getMany(args: MediaAssetDaoGetManyArgs): Promise<MediaAsset[]>;
  addOne(args: MediaAssetDaoAddOneArgs): Promise<MediaAsset>;
  addMany(mediaAssets: MediaAssetDaoAddManyArgs): Promise<MediaAsset[]>;
  deleteOne(id: string): Promise<boolean>;
}
