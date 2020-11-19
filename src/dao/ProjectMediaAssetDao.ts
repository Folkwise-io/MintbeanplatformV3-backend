import { ProjectMediaAssetServiceAddOneArgs } from "../service/ProjectMediaAssetService";

export default interface ProjectMediaAssetDao {
  addMany(projectMediaAssets: ProjectMediaAssetServiceAddOneArgs[]): Promise<void>;
}
