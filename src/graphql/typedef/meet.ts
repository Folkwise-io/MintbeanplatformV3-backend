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

    "Wallclock times"
    startTime: String!
    endTime: String!

    createdAt: String!
    updatedAt: String!

    "The IANA region used with wallclock time"
    region: String!
  }

  extend type Query {
    "Gets all the meets in descending startTime order"
    meets: [Meet]
  }
`;

export default meet;
