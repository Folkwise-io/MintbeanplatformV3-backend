import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

const user: DocumentNode = gql`
  type User {
    "User's ID in UUID"
    id: UUID!

    "Unique username"
    username: String!

    "Unique email"
    email: String!

    "The user's hashed password"
    passwordHash: String!

    firstName: String!
    lastName: String!

    "Date that the user registered"
    createdAt: String!
  }

  type Query {
    "Search for users by first or last name"
    users(firstName: String, lastName: String): [User]

    "Get a single user by ID or username"
    user(id: UUID, username: String): User

    "Login using email and password"
    login(email: String!, password: String!): User
  }
`;

export default user;
