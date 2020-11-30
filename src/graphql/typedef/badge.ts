import { gql } from "apollo-server-express";

const badge = gql`
  "A badge awarded by Mintbean for excellence within the Mintbean community!"
  type Badge {
    "ID of the badge in UUID"
    id: UUID!
    "A user friendly :colon-surrounded: badge alias."
    alias: String!
    "The shape of the enclosing badge from an enumerable list"
    badgeShape: String!
    "The Font Awesome icon that will be the graphic of the badge (required)"
    faIcon: String!
    "The hex code for the background color (all 6 digits, no # before code) defaults to 000000 (black)"
    backgroundHex: String
    "The hex code for the icon color (all 6 digits, no # before code). defaults to ffffff (white)"
    iconHex: String
    "The official title of the badge"
    title: String!
    "The official description of the badge"
    description: String
    "The weight of this badge"
    weight: Int
    "When this badge was first created"
    createdAt: DateTime!
    "When this badge was last updated"
    updatedAt: DateTime!
    "A list of projects awarded this badge"
    projects: [Project]
  }
  extend type Query {
    "Gets all the badges"
    badges: [Badge]
    "Gets one badge by id or alias"
    badge(id: UUID!): Badge
  }

  "The input needed to create a new badge"
  input CreateBadgeInput {
    "The alias of the badge"
    alias: String!
    "The shape of the badge from an enumerable list"
    badgeShape: String!
    "The Font Awesome icon that will be the graphic of the badge (required)"
    faIcon: String!
    "The hex code for the background color (all 6 digits, no # before code) defaults to 000000 (black)"
    backgroundHex: String
    "The hex code for the icon color (all 6 digits, no # before code). defaults to ffffff (white)"
    iconHex: String
    "The title of the badge"
    title: String!
    "A description of the badge (optional)"
    description: String
    "How heavily this badge should be weighted(optional)"
    weight: Int
  }

  "Input that can be used to edit a badge - all fields are optional"
  input EditBadgeInput {
    "The alias of the badge"
    alias: String
    "The shape of the badge from an enumerable list"
    badgeShape: String
    "The Font Awesome icon that will be the graphic of the badge (required)"
    faIcon: String
    "The hex code for the background color (all 6 digits, no # before code) defaults to 000000 (black)"
    backgroundHex: String
    "The hex code for the icon color (all 6 digits, no # before code). defaults to ffffff (white)"
    iconHex: String
    "The title of the badge"
    title: String
    "A description of the badge (optional)"
    description: String
    "How heavily this badge should be weighted(optional)"
    weight: Int
  }

  extend type Mutation {
    "Creates a new badge (requires admin privileges"
    createBadge(input: CreateBadgeInput!): Badge!
    "Edits a badge (requires admin privileges)"
    editBadge(id: UUID!, input: EditBadgeInput!): Badge!
    "Deletes a badge (requires admin privileges)"
    deleteBadge(id: UUID!): Boolean!
  }

  extend type Project {
    "The badges associated with the project"
    badges: [Badge]
  }
`;

export default badge;
