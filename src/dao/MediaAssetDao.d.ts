import { MediaAsset } from "../types/gqlGeneratedTypes";
import {
  MediaAssetServiceAddOneInput,
  MediaAssetServiceEditOneInput,
  MediaAssetServiceGetManyArgs,
} from "../service/MediaAssetService";

export default interface MediaAssetDao {
  getOne(args: UserServiceGetOneArgs): Promise<MediaAsset>;
  getMany(args: MediaAssetServiceGetManyArgs): Promise<MediaAsset[]>;
  addOne(args: MediaAssetServiceAddOneInput): Promise<MediaAsset>;
  addMany(mediaAssets: MediaAssetServiceAddManyInput): Promise<MediaAsset[]>;
  editOne(id: string, input: MediaAssetServiceEditOneInput): Promise<MediaAsset>;
  deleteOne(id: string): Promise<boolean>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
}
