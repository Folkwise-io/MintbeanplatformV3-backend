import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

const user: DocumentNode = gql`
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

  type Query {
    "Search for users by first or last name"
    users(firstName: String, lastName: String): [User]

    "Get a single user by ID or username"
    user(id: ID, username: String): User
  }
`;

export default user;
