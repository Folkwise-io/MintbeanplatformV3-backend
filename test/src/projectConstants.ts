import { gql } from "apollo-server-express";

export const AMY_PAPERJS_PROJECT = {
  id: "00000000-0000-0000-0000-000000000000",
  userId: "00000000-0000-0000-0000-000000000000",
  meetId: "00000000-0000-0000-0000-000000000000",
  title: "Amy's PaperJS Submission",
  sourceCodeUrl: "http://github.com",
  liveUrl: "http://google.com",
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
};

export const AMY_ALGOLIA_PROJECT = {
  id: "00000000-0000-4000-a000-000000000000",
  userId: "00000000-0000-0000-0000-000000000000",
  meetId: "00000000-0000-4000-a000-000000000000",
  title: "Amy's Algolia Submission",
  sourceCodeUrl: "http://github.com",
  liveUrl: "http://google.com",
  createdAt: "2020-09-15T12:00:00.000Z",
  updatedAt: "2020-09-15T12:00:00.000Z",
};

export const GET_PROJECT = gql`
  query getProjectById($id: UUID!) {
    project(id: $id) {
      id
      userId
      meetId
      title
      sourceCodeUrl
      liveUrl
      createdAt
      updatedAt
    }
  }
`;
