export interface ProjectMediaAssetDaoAddOneArgs {
  mediaAssetId: string;
  projectId: string;
}

export default interface ProjectMediaAssetDao {
  addMany(projectMediaAssets: ProjectMediaAssetDaoAddOneArgs[]): Promise<void>;
}
