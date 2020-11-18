import { gql } from "apollo-server-express";
import { Badge, CreateBadgeInput, EditBadgeInput } from "../../src/types/gqlGeneratedTypes";

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

export const GET_BADGE_BY_ID = gql`
  query getBadgeById($id: UUID) {
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
  createBadge($input: CreateBadgeInput) {
    createBadge(input: $input) {
      id
      badgeShape
      alias
      title
      faIcon
      weight
      backgroundHex
      iconHex
    }
  }
`;

export const NEW_BADGE_INPUT: CreateBadgeInput = {
  alias: ":ad:",
  faIcon: "ad",
  title: "Ad",
  description: "The ad badge",
  badgeShape: "star",
  backgroundHex: "123123",
  iconHex: "234234",
  weight: 123,
};

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

export const EDIT_BADGE_INPUT: EditBadgeInput = {
  description: "This is the first place badge awarded to an exceptional hackathon entry!",
};

export const DELETE_BADGE = gql`
  mutation deleteBadge($id: UUID!) {
    deleteBadge(id: $id)
  }
`;
