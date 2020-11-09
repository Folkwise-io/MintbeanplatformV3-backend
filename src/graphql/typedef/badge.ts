import { gql } from "apollo-server-express";

const badge = gql`
  "A list of the different border shapes a badge can have"
  enum BadgeShapes {
    star
    circle
    square
  }

  "A badge awarded by Mintbean for excellence within the Mintbean community!"
  type Badge {
    "ID of the badge in UUID"
    badgeId: UUID!
    "A user friendly :colon-surrounded: badge alias."
    alias: String!
    "The shape of the enclosing badge"
    badgeShape: BadgeShapes!
    "The Font Awesome icon that will be the graphic of the badge (required)"
    faIcon: String!
    "The hex code for the background color (all 6 digits, no # before code)"
    backgroundHex: String
    "The hex code for the icon color (all 6 digits, no # before code)"
    iconHex: String
    "the official title of the badge"
    title: String!
    "the official description of the badge"
    description: String
    "the weight of this badge"
    weight: Int
    "when this badge was first created"
    createdAt: DateTime!
    "when this badge was last updated"
    updatedAt: DateTime!
  }
  extend type Query {
    "Gets all the badges"
    badges: [Badge]
    "gets one badge by id or alias"
    badge(badgeId: UUID!): Badge
  }

  "the input needed to create a new badge"
  input CreateBadgeInput {
    "the id of the badge"
    badgeId: String!
    "the alias of the badge"
    alias: String!
    "the shape of the badge"
    badgeShape: BadgeShapes!
    "The Font Awesome icon that will be the graphic of the badge (required)"
    faIcon: String!
    "the background color of the badge(optional)"
    backgroundHex: String
    "the color of the icon(optional)"
    iconHex: String
    "the title of the badge"
    title: String!
    "a description of the badge (optional)"
    description: String
    "how heavily this badge should be weighted(optional)"
    weight: Int
  }

  "Input that can be used to edit a badge - all fields are optional"
  input EditBadgeInput {
    "the alias of the badge"
    alias: String
    "the shape of the badge"
    badgeShape: BadgeShapes
    "The Font Awesome icon that will be the graphic of the badge (required)"
    faIcon: String
    "the background color of the badge(optional)"
    backgroundHex: String
    "the color of the icon(optional)"
    iconHex: String
    "the title of the badge"
    title: String
    "a description of the badge (optional)"
    description: String
    "how heavily this badge should be weighted(optional)"
    weight: Int
  }

  extend type Mutation {
    "Creates a new badge (requires admin privileges"
    createBadge(input: CreateBadgeInput!): Badge!
    "Edits a badge (requires admin privileges)"
    editBadge(badgeId: UUID!, input: EditBadgeInput!): Badge!
    "Deletes a badge (requires admin privileges)"
    deleteBadge(badgeId: UUID!): Boolean!
  }
`;

export default badge;
