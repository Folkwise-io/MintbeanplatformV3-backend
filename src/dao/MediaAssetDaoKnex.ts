import Knex from "knex";
import { MediaAsset } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import MediaAssetDao, { MediaAssetDaoAddManyArgs, MediaAssetDaoGetManyArgs } from "./MediaAssetDao";

export default class MediaAssetDaoKnex implements MediaAssetDao {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getMany(args: MediaAssetDaoGetManyArgs): Promise<MediaAsset[]> {
    // Only tested with projectId lookup for now
    // TODO: Add support for userId lookup
    return handleDatabaseError(async () => {
      const mediaAssets = await this.knex("mediaAssets")
        .join("projectMediaAssets", "mediaAssets.id", "=", "projectMediaAssets.mediaAssetId")
        .where({ ...args, "mediaAssets.deleted": false })
        .orderBy("index");

      return mediaAssets;
    });
  }

  addOne(args: any): Promise<MediaAsset> {
    throw new Error("Method not implemented.");
  }

  addMany(mediaAssets: MediaAssetDaoAddManyArgs): Promise<MediaAsset[]> {
    return handleDatabaseError(() => this.knex<MediaAsset>("mediaAssets").insert(mediaAssets).returning("*"));
  }

  editOne(id: string, input: any): Promise<MediaAsset> {
    throw new Error("Method not implemented.");
  }

  deleteOne(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
