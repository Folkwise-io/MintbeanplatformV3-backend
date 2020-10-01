import { gql } from "apollo-server-express";

const meetRegistration = gql`
  extend type Meet {
    "A list of users that are registered for the Meet"
    registrants: [PublicUser!]
  }

  extend type PrivateUser {
    "A list of meets that the user has registered for"
    registeredMeets: [Meet!]
  }

  extend type PublicUser {
    "A list of meets that the user has registered for"
    registeredMeets: [Meet!]
  }

  extend type Mutation {
    "Registers the current logged-in user for a meet."
    registerForMeet(id: UUID!): Boolean!
  }
`;

export default meetRegistration;
