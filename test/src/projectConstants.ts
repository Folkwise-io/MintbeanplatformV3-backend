import { gql } from "apollo-server-express";
import { CreateProjectInput } from "../../src/types/gqlGeneratedTypes";

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

export const BOB_PAPERJS_PROJECT = {
  id: "00000000-0000-4000-a000-000000000001",
  userId: "00000000-0000-4000-a000-000000000000",
  meetId: "00000000-0000-0000-0000-000000000000",
  title: "Bob's PaperJS Submission",
  sourceCodeUrl: "http://github.com",
  liveUrl: "http://google.com",
  createdAt: "2020-10-15T12:00:00.000Z",
  updatedAt: "2020-10-15T12:00:00.000Z",
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

export const GET_PROJECT_WITH_NESTED_USER = gql`
  query getProjectByIdWithUser($id: UUID!) {
    project(id: $id) {
      id
      userId
      meetId
      title
      sourceCodeUrl
      liveUrl
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_USER_WITH_NESTED_PROJECTS = gql`
  query getUsersProjects($id: UUID!) {
    user(id: $id) {
      id
      firstName
      lastName
      projects {
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
  }
`;

export const GET_ALL_MEETS_WITH_NESTED_PROJECTS = gql`
  query getAllMeets {
    meets {
      id
      meetType
      title
      description
      instructions
      registerLink
      registerLinkStatus
      coverImageUrl
      startTime
      endTime
      createdAt
      updatedAt
      region
      projects {
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
  }
`;

export const GET_PROJECT_WITH_NESTED_MEET = gql`
  query getProjectByIdWithMeet($id: UUID!) {
    project(id: $id) {
      id
      userId
      meetId
      title
      sourceCodeUrl
      liveUrl
      createdAt
      updatedAt
      meet {
        id
        meetType
        title
        description
        instructions
        registerLink
        registerLinkStatus
        coverImageUrl
        startTime
        endTime
        createdAt
        updatedAt
        region
      }
    }
  }
`;

export const NEW_PROJECT: CreateProjectInput = {
  meetId: "00000000-0000-0000-0000-000000000000",
  title: "Someone's PaperJS Submission",
  sourceCodeUrl: "http://github.com",
  liveUrl: "http://google.com",
};

export const CREATE_PROJECT = gql`
  mutation createProject($input: CreateProjectInput!) {
    createProject(input: $input) {
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

export const NEW_PROJECT_WITH_MEDIA_ASSETS: CreateProjectInput = {
  meetId: "00000000-0000-0000-0000-000000000000",
  title: "Someone's PaperJS Submission",
  sourceCodeUrl: "http://github.com",
  liveUrl: "http://google.com",
  cloudinaryPublicIds: ["abcdef", "ghijkl"],
};

export const DELETE_PROJECT = gql`
  mutation deleteProject($id: UUID!) {
    deleteProject(id: $id)
  }
`;
