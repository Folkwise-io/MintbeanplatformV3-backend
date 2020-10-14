import { gql } from "apollo-server-express";

const meet = gql`
  "An event hosted by Mintbean. Only Hack Meets exist for now but will include workshops etc. in the future"
  type Meet {
    "ID of the Meet in UUID"
    id: UUID!

    "The type of the Meet as enum string. Only hackMeet is supported for now"
    meetType: String!

    title: String!

    "A short blurb about the Meet"
    description: String!

    "The instructions in markdown format"
    instructions: String!

    registerLink: String
    coverImageUrl: String!

    "Wallclock times"
    startTime: String!
    endTime: String!

    "DateTime that the meet was created"
    createdAt: DateTime!

    "DateTime that the meet was modified"
    updatedAt: DateTime!

    "The IANA region used with wallclock time"
    region: String!
  }

  extend type Query {
    "Get a meet by ID"
    meet(id: UUID!): Meet

    "Gets all the meets in descending startTime order"
    meets: [Meet]
  }

  "The input needed to create a new meet"
  input CreateMeetInput {
    "The type of the Meet as enum string. Only hackMeet is supported for now"
    meetType: String!

    title: String!

    "A short blurb about the Meet"
    description: String!

    "The instructions in markdown format"
    instructions: String!

    registerLink: String
    coverImageUrl: String!

    "Wallclock times"
    startTime: String!
    endTime: String!

    "The IANA region used with wallclock time"
    region: String!
  }

  "Input that can be used to edit a meet - all fields are optional"
  input EditMeetInput {
    "The type of the Meet as enum string. Only hackMeet is supported for now"
    meetType: String

    title: String

    "A short blurb about the Meet"
    description: String

    "The instructions in markdown format"
    instructions: String

    registerLink: String
    coverImageUrl: String

    "Wallclock times"
    startTime: String
    endTime: String

    "The IANA region used with wallclock time"
    region: String

    "The optional kanban associated with this meet"
    kanbanId: UUID
  }

  extend type Mutation {
    "Creates a new meet (only hackMeet is supported for now)"
    createMeet(input: CreateMeetInput!): Meet!

    "Edits a meet (requires admin privileges)"
    editMeet(id: UUID!, input: EditMeetInput!): Meet!

    "Deletes a meet (requires admin privileges)"
    deleteMeet(id: UUID!): Boolean!
  }
`;

export default meet;
