import { gql } from "apollo-server-express";
import { Badge, CreateBadgeInput, EditBadgeInput, MutationAwardBadgesArgs } from "../../src/types/gqlGeneratedTypes";

export const WINNER_FIRST: Badge = {
  id: "00000000-0000-0000-0000-000000000000",
  alias: ":winner-first:",
  badgeShape: "star",
  faIcon: "trophy",
  backgroundHex: "000000",
  iconHex: "f9ce13",
  title: "Winner - 1st place",
  description: "",
  weight: 1000,
  createdAt: "2020-11-13T18:02:07.614Z",
  updatedAt: "2020-11-13T22:03:58.377Z",
};

export const WINNER_SECOND: Badge = {
  id: "00000000-0000-4000-a000-000000000000",
  alias: ":winner-second:",
  badgeShape: "square",
  faIcon: "medal",
  backgroundHex: "2bf0e5",
  iconHex: "f26d35",
  title: "2nd place",
  description: "This is the second place badge awarded to an exceptional hackathon entry!",
  weight: 750,
  createdAt: "2020-11-13T18:02:07.614Z",
  updatedAt: "2020-11-13T22:31:24.455Z",
};

export const WINNER_THIRD: Badge = {
  id: "00000000-0000-4000-a000-000000000001",
  alias: ":winner-third:",
  badgeShape: "circle",
  faIcon: "award",
  backgroundHex: "fb8a13",
  iconHex: "b418cb",
  title: "3rd place",
  description: "",
  weight: 500,
  createdAt: "2020-11-20T19:26:39.737Z",
  updatedAt: "2020-11-20T19:26:39.737Z",
};

export const NEW_BADGE_INPUT: CreateBadgeInput = {
  alias: ":anchored:",
  badgeShape: "square",
  faIcon: "anchor",
  backgroundHex: "5B25D3",
  iconHex: "24E5A3",
  title: "Anchored into Code",
  description: "someone who stays near the ground and doesn't leave",
  weight: 200,
};

export const EDIT_BADGE_INPUT: EditBadgeInput = {
  description: "This is the first place badge awarded to an exceptional hackathon entry!",
};

export const GET_BADGE_BY_ID = gql`
  query getBadgeById($id: UUID!) {
    badge(id: $id) {
      id
      alias
      badgeShape
      faIcon
      backgroundHex
      iconHex
      title
      description
      weight
      createdAt
    }
  }
`;

export const GET_ALL_BADGES = gql`
  query getBadges {
    badges {
      id
      alias
      badgeShape
      faIcon
      backgroundHex
      iconHex
      title
      description
      weight
      projects {
        title
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_BADGE = gql`
  mutation createBadge($input: CreateBadgeInput!) {
    createBadge(input: $input) {
      id
      badgeShape
      description
      alias
      title
      faIcon
      weight
      backgroundHex
      iconHex
    }
  }
`;

export const EDIT_BADGE = gql`
  mutation editBadge($id: UUID!, $input: EditBadgeInput!) {
    editBadge(id: $id, input: $input) {
      alias
      badgeShape
      faIcon
      backgroundHex
      iconHex
      title
      description
      weight
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_BADGE = gql`
  mutation deleteBadge($id: UUID!) {
    deleteBadge(id: $id)
  }
`;

export const GET_BADGE_WITH_NESTED_PROJECT = gql`
  query getBadgeByIdWithProjects($id: UUID!) {
    badge(id: $id) {
      id
      alias
      badgeShape
      faIcon
      backgroundHex
      iconHex
      title
      description
      weight
      projects {
        id
        title
        sourceCodeUrl
        liveUrl
        createdAt
      }
      createdAt
    }
  }
`;

export const GET_PROJECT_WITH_NESTED_BADGES = gql`
  query getProjectByIdWithBadges($id: UUID!) {
    project(id: $id) {
      id
      title
      sourceCodeUrl
      liveUrl
      createdAt
      badges {
        id
        alias
        badgeShape
        faIcon
        backgroundHex
        iconHex
        title
        description
        weight
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_MEET_WITH_NESTED_BADGES = gql`
  query getMeetByIdWithBadges($id: UUID = "00000000-0000-0000-0000-000000000000") {
    meet(id: $id) {
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
      region
      projects {
        id
        title
        badges {
          id
          alias
          badgeShape
          faIcon
          backgroundHex
          iconHex
          title
          description
          weight
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const AWARD_BADGES = gql`
  mutation awardBadgesToProject($projectId: UUID!, $badgeIds: [UUID]!) {
    awardBadges(projectId: $projectId, badgeIds: $badgeIds) {
      id
      title
      sourceCodeUrl
      liveUrl
      createdAt
      badges {
        id
        alias
        badgeShape
        faIcon
        backgroundHex
        iconHex
        title
        description
        weight
        createdAt
        updatedAt
      }
    }
  }
`;
