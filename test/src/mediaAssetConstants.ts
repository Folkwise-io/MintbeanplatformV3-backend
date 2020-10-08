import { gql } from "apollo-server-express";
import { MediaAsset } from "../../src/types/gqlGeneratedTypes";
import ProjectMediaAsset from "../../src/types/ProjectMediaAsset";
import { AMY_PAPERJS_PROJECT, BOB_PAPERJS_PROJECT } from "./projectConstants";

export const AMY_PAPERJS_MEDIA_ASSET_1: MediaAsset = {
  id: "00000000-0000-0000-0000-000000000000",
  userId: "00000000-0000-0000-0000-000000000000",
  cloudinaryPublicId: "uaxkolonhp2lik1dnvzb",
  index: 0,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const AMY_PAPERJS_MEDIA_ASSET_2: MediaAsset = {
  id: "00000000-0000-4000-a000-000000000000",
  userId: "00000000-0000-0000-0000-000000000000",
  cloudinaryPublicId: "jia7kqinylpoy96gzftg",
  index: 1,
  createdAt: "2020-09-15T12:00:00.000Z",
  updatedAt: "2020-09-15T12:00:00.000Z",
};

export const BOB_PAPERJS_MEDIA_ASSET_1: MediaAsset = {
  id: "00000000-0000-4000-a000-000000000001",
  userId: "00000000-0000-4000-a000-000000000000",
  cloudinaryPublicId: "wzk5axcfxliedyrblkdj",
  index: 0,
  createdAt: "2020-10-15T12:00:00.000Z",
  updatedAt: "2020-10-15T12:00:00.000Z",
};

export const AMY_PAPERJS_MEDIA_ASSET_1_JOIN: ProjectMediaAsset = {
  id: "00000000-0000-0000-0000-000000000000",
  mediaAssetId: AMY_PAPERJS_MEDIA_ASSET_1.id,
  projectId: AMY_PAPERJS_PROJECT.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
  deleted: false,
};

export const AMY_PAPERJS_MEDIA_ASSET_2_JOIN: ProjectMediaAsset = {
  id: "00000000-0000-4000-a000-000000000000",
  mediaAssetId: AMY_PAPERJS_MEDIA_ASSET_2.id,
  projectId: AMY_PAPERJS_PROJECT.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
  deleted: false,
};

export const BOB_PAPERJS_MEDIA_ASSET_1_JOIN: ProjectMediaAsset = {
  id: "00000000-0000-4000-a000-000000000001",
  mediaAssetId: BOB_PAPERJS_MEDIA_ASSET_1.id,
  projectId: BOB_PAPERJS_PROJECT.id,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
  deleted: false,
};

export const GET_PROJECT_WITH_NESTED_MEDIA_ASSETS = gql`
  query getProjectByIdWithMediaAssets($id: UUID!) {
    project(id: $id) {
      id
      userId
      meetId
      title
      sourceCodeUrl
      liveUrl
      createdAt
      updatedAt
      mediaAssets {
        index
        cloudinaryPublicId
      }
    }
  }
`;
