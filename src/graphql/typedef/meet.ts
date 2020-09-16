import { gql } from "apollo-server-express";

const meet = gql`
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

    "Wallclock DateTimes - may need to truncate the Z to use them as intended"
    startTime: DateTime!
    endTime: DateTime!

    "DateTime that the meet was created"
    createdAt: DateTime!

    "DateTime that the meet was modified"
    updatedAt: DateTime!

    "The IANA region used with wallclock time"
    region: String!
  }

  extend type Query {
    "Gets all the meets in descending startTime order"
    meets: [Meet]
  }
`;

export default meet;
