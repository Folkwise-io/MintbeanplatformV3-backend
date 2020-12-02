import Knex from "knex";
import MediaAssetDaoKnex from "../../../src/dao/MediaAssetDaoKnex";
import { MediaAsset } from "../../../src/types/gqlGeneratedTypes";

export default class TestMediaAssetDaoKnex extends MediaAssetDaoKnex {
  constructor(knex: Knex) {
    super(knex);
  }

  async deleteAll(): Promise<void> {
    return this.knex<MediaAsset>("mediaAssets").delete();
  }
}
