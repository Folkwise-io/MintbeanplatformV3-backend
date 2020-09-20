import Knex from "knex";
import { MediaAssetServiceAddManyArgs } from "../service/MediaAssetService";
import { MediaAsset } from "../types/gqlGeneratedTypes";
import MediaAssetDao from "./MediaAssetDao";

export default class MediaAssetDaoKnex implements MediaAssetDao {
  constructor(private knex: Knex) {}

  getOne(args: any): Promise<MediaAsset> {
    throw new Error("Method not implemented.");
  }

  getMany(args: any): Promise<MediaAsset[]> {
    throw new Error("Method not implemented.");
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
