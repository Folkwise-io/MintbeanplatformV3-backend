import { gql } from "apollo-server-express";

export const MEDIA_ASSET_1 = {
  id: "00000000-0000-0000-0000-000000000000",
  userId: "00000000-0000-0000-0000-000000000000",
  cloudinaryPublicId: "uaxkolonhp2lik1dnvzb",
  index: 0,
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const MEDIA_ASSET_2 = {
  id: "00000000-0000-4000-a000-000000000000",
  userId: "00000000-0000-0000-0000-000000000000",
  cloudinaryPublicId: "jia7kqinylpoy96gzftg",
  index: 1,
  createdAt: "2020-09-15T12:00:00.000Z",
  updatedAt: "2020-09-15T12:00:00.000Z",
};

export const MEDIA_ASSET_3 = {
  id: "00000000-0000-4000-a000-000000000001",
  userId: "00000000-0000-4000-a000-000000000000",
  cloudinaryPublicId: "wzk5axcfxliedyrblkdj",
  createdAt: "2020-10-15T12:00:00.000Z",
  updatedAt: "2020-10-15T12:00:00.000Z",
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
