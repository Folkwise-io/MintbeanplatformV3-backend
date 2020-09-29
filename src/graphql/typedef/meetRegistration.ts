import { gql } from "apollo-server-express";

const meetRegistration = gql`
  extend type Meet {
    "A list of users that are registered for the Meet"
    registrants: [User!]
  }

  extend type User {
    "A list of meets that the user has registered for"
    registeredMeets: [Meet!]
  }
`;

export default meetRegistration;
