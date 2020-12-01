import MediaAssetDao from "../../dao/MediaAssetDao";
import { MediaAsset, Resolvers } from "../../types/gqlGeneratedTypes";

const mediaAssetResolver = (mediaAssetDao: MediaAssetDao): Resolvers => {
  return {
    Project: {
      mediaAssets: (project): Promise<MediaAsset[]> => {
        return mediaAssetDao.getMany({ projectId: project.id });
      },
    },
  };
};

export default mediaAssetResolver;
