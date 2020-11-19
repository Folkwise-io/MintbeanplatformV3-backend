import MediaAssetDao, {
  MediaAssetDaoAddManyArgs,
  MediaAssetDaoAddOneArgs,
  MediaAssetDaoGetManyArgs,
} from "../dao/MediaAssetDao";
import { MediaAsset } from "../types/gqlGeneratedTypes";
import { EntityService } from "./EntityService";

export default class MediaAssetService implements EntityService<MediaAsset> {
  constructor(private mediaAssetDao: MediaAssetDao) {}

  async getMany(args: MediaAssetDaoGetManyArgs): Promise<MediaAsset[]> {
    return this.mediaAssetDao.getMany(args);
  }

  async addOne(input: MediaAssetDaoAddOneArgs, context: any): Promise<MediaAsset> {
    throw new Error("not emplemented");
  }

  async addMany(args: MediaAssetDaoAddManyArgs): Promise<MediaAsset[]> {
    return this.mediaAssetDao.addMany(args);
  }
}
