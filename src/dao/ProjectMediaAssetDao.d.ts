import ProjectMediaAsset from "../types/projectMediaAsset";

export default interface ProjectMediaAssetDao {
  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(projectMediaAssets: ProjectMediaAssetServiceAddManyArgs[]): Promise<void>;
}
