import { ProjectMediaAssetServiceAddOneArgs } from "../service/ProjectMediaAssetService";

export default interface ProjectMediaAssetDao {
  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(projectMediaAssets: ProjectMediaAssetServiceAddOneArgs[]): Promise<void>;
}
