import { gql } from "apollo-server-express";

export default gql`
  type User {
    "ID in UUID"
    id: ID!

    "Unique username"
    username: String

    firstName: String
    lastName: String

    "Date that the user registered"
    createdAt: String
  }

  extend type Query {
    "Get all the users"
    users: [User]

    "Get user by ID"
    user(id: ID!): User
  }
`;
