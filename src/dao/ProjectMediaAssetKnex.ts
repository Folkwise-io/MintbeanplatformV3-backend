import Knex from "knex";
import handleDatabaseError from "../util/handleDatabaseError";
import ProjectMediaAssetDao, { ProjectMediaAssetDaoAddOneArgs } from "./ProjectMediaAssetDao";

export default class ProjectMediaAssetDaoKnex implements ProjectMediaAssetDao {
  constructor(private knex: Knex) {}

  async addMany(projectMediaAssets: ProjectMediaAssetDaoAddOneArgs[]): Promise<void> {
    return handleDatabaseError(() => this.knex("projectMediaAssets").insert(projectMediaAssets));
  }
}
