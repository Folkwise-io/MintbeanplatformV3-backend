import ProjectMediaAssetDao, { ProjectMediaAssetDaoAddOneArgs } from "../dao/ProjectMediaAssetDao";
import ProjectMediaAsset from "../types/ProjectMediaAsset";
import { EntityService } from "./EntityService";

export default class ProjectMediaAssetService implements EntityService<ProjectMediaAsset> {
  constructor(private projectMediaAssetDao: ProjectMediaAssetDao) {}

  async getOne(args: any, context: any): Promise<ProjectMediaAsset> {
    throw new Error("not emplemented");
  }

  async getMany(args: any): Promise<ProjectMediaAsset[]> {
    throw new Error("not emplemented");
  }

  async addOne(input: any, context: any): Promise<ProjectMediaAsset> {
    throw new Error("not emplemented");
  }

  async addMany(args: ProjectMediaAssetDaoAddOneArgs[]): Promise<void> {
    return this.projectMediaAssetDao.addMany(args);
  }
}
