import MediaAssetService from "../../service/MediaAssetService";
import { MediaAsset, Resolvers } from "../../types/gqlGeneratedTypes";
import MediaAssetResolverValidator from "../../validator/MediaAssetResolverValidator";

const mediaAssetResolver = (
  mediaAssetResolverValidator: MediaAssetResolverValidator,
  mediaAssetService: MediaAssetService,
): Resolvers => {
  return {
    Project: {
      mediaAssets: (project): Promise<MediaAsset[]> => {
        return mediaAssetService.getMany({ projectId: project.id });
      },
    },
  };
};

export default mediaAssetResolver;
