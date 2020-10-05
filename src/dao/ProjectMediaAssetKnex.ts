import Knex from "knex";
import { ProjectMediaAssetServiceAddOneArgs } from "../service/ProjectMediaAssetService";
import handleDatabaseError from "../util/handleDatabaseError";
import ProjectMediaAssetDao from "./ProjectMediaAssetDao";

export default class ProjectMediaAssetDaoKnex implements ProjectMediaAssetDao {
  constructor(private knex: Knex) {}

  async deleteAll(): Promise<void> {
    throw new Error("not implemented");
  }

  async addMany(projectMediaAssets: ProjectMediaAssetServiceAddOneArgs[]): Promise<void> {
    return handleDatabaseError(() => this.knex("projectMediaAssets").insert(projectMediaAssets));
  }
}
