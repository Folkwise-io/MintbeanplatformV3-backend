import Knex from "knex";
import ProjectMediaAssetServiceAddManyArgs from "../service/ProjectMediaAssetService";
import ProjectMediaAsset from "../types/projectMediaAsset";
import ProjectMediaAssetDao from "./ProjectMediaAssetDao";

export default class ProjectMediaAssetDaoKnex implements ProjectMediaAssetDao {
  constructor(private knex: Knex) {}

  async deleteAll(): Promise<void> {
    throw new Error("not implemented");
  }

  async addMany(projectMediaAssets: ProjectMediaAssetServiceAddManyArgs[]): Promise<void> {
    return this.knex<ProjectMediaAsset>("projectMediaAssets").insert(projectMediaAssets);
  }
}
