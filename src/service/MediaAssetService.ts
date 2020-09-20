import MediaAssetDao from "../dao/MediaAssetDao";
import { MediaAsset } from "../types/gqlGeneratedTypes";
import { Args, EntityService } from "./EntityService";

export interface MediaAssetServiceAddManyArgs {
  userId: string;
  meetId?: string | null;
  cloudinaryPublicId: string;
  index?: number;
}

export interface MediaAssetServiceGetManyArgs {
  // userId?: string | null;
  projectId?: string | null;
}

export default class MediaAssetService implements EntityService<MediaAsset> {
  constructor(private mediaAssetDao: MediaAssetDao) {}

  async getOne(args: any, context: any): Promise<MediaAsset> {
    throw new Error("not emplemented");
  }

  async getMany(args: MediaAssetServiceGetManyArgs): Promise<MediaAsset[]> {
    return this.mediaAssetDao.getMany(args);
  }

  async addOne(input: any, context: any): Promise<MediaAsset> {
    throw new Error("not emplemented");
  }
  async addMany(args: MediaAssetServiceAddManyArgs, context: any): Promise<MediaAsset[]> {
    return this.mediaAssetDao.addMany(args);
  }
}
