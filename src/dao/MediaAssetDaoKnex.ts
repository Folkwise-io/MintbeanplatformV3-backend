import Knex from "knex";
import { MediaAssetServiceAddManyArgs, MediaAssetServiceGetManyArgs } from "../service/MediaAssetService";
import { MediaAsset } from "../types/gqlGeneratedTypes";
import MediaAssetDao from "./MediaAssetDao";

export default class MediaAssetDaoKnex implements MediaAssetDao {
  constructor(private knex: Knex) {}

  getOne(args: any): Promise<MediaAsset> {
    throw new Error("Method not implemented.");
  }

  async getMany(args: MediaAssetServiceGetManyArgs): Promise<MediaAsset[]> {
    // Only tested with projectId lookup for now
    // TODO: Add support for userId lookup
    const mediaAssets = await this.knex("mediaAssets")
      .join("projectMediaAssets", "mediaAssets.id", "=", "projectMediaAssets.mediaAssetId")
      .where({ ...args, "mediaAssets.deleted": false })
      .orderBy("index");

    return mediaAssets;
  }

  addOne(args: any): Promise<MediaAsset> {
    throw new Error("Method not implemented.");
  }

  addMany(mediaAssets: MediaAssetServiceAddManyArgs): Promise<MediaAsset[]> {
    return this.knex<MediaAsset>("mediaAssets").insert(mediaAssets).returning("*");
  }

  editOne(id: string, input: any): Promise<MediaAsset> {
    throw new Error("Method not implemented.");
  }

  deleteOne(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  deleteAll(): Promise<void> {
    return this.knex<MediaAsset>("mediaAssets").delete();
  }
}
