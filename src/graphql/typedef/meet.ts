import { gql } from "apollo-server-express";

const meet = gql`
  "Whether registration is going to open, is open now, or is closed."
  enum RegisterLinkStatus {
    WAITING
    OPEN
    CLOSED
  }

  "The different meet types that are currently available"
  enum MeetType {
    HACKATHON
    WORKSHOP
    WEBINAR
    LECTURE
  }

  "An event hosted by Mintbean. Only Hack Meets exist for now but will include workshops etc. in the future"
  type Meet {
    "ID of the Meet in UUID"
    id: UUID!

    "The type of the Meet as enum string."
    meetType: MeetType!

    title: String!

    "A short blurb about the Meet"
    description: String!

    "The instructions in markdown format"
    instructions: String!

    registerLink: String
    registerLinkStatus: RegisterLinkStatus
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
    "The type of the Meet as enum string. (currently supported meetTypes are hackathon, workshop, webinar and lecture)"
    meetType: MeetType!

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
    "The type of the Meet as enum string. Only (currently supported meetTypes are hackathon, workshop, webinar and lecture)"
    meetType: MeetType

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
  }

  extend type Mutation {
    "Creates a new meet (currently supported meetTypes are hackathon, workshop, webinar and lecture)"
    createMeet(input: CreateMeetInput!): Meet!

    "Edits a meet (requires admin privileges)"
    editMeet(id: UUID!, input: EditMeetInput!): Meet!

    "Deletes a meet (requires admin privileges)"
    deleteMeet(id: UUID!): Boolean!
  }
`;

export default meet;
