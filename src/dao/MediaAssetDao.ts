import { MediaAsset } from "../types/gqlGeneratedTypes";
import {
  MediaAssetServiceAddOneArgs,
  MediaAssetServiceGetManyArgs,
  MediaAssetServiceAddManyArgs
} from "../service/MediaAssetService";

export default interface MediaAssetDao {
  getMany(args: MediaAssetServiceGetManyArgs): Promise<MediaAsset[]>;
  addOne(args: MediaAssetServiceAddOneArgs): Promise<MediaAsset>;
  addMany(mediaAssets: MediaAssetServiceAddManyArgs): Promise<MediaAsset[]>;
  deleteOne(id: string): Promise<boolean>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
}
