import { gql } from "apollo-server-express";

const meet = gql`
  type Meet {
    "ID of the Meet in UUID"
    id: UUID!

    title: String!
    description: String!
    coverImageUrl: String!
    instructions: String!
    startTime: String!
    endTime: String!
    createdAt: String!
    updatedAt: String!
    registerLink: String!
    region: String!
  }
`;

export default meet;
