import { gql } from "apollo-server-express";

const user = gql`
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

    "DateTime that the user registered"
    createdAt: DateTime!

    "DateTime that the user updated their profile"
    updatedAt: DateTime!

    "Whether the user has admin privileges to create/modify events"
    isAdmin: Boolean!

    "A JWT created for the user after login (also sent in cookies)"
    token: String
  }

  type Query {
    "Search for users by first or last name"
    users(firstName: String, lastName: String): [User]

    "Get a single user by ID, username, or email"
    user(id: UUID, username: String, email: String): User

    "Get the current logged in user using cookies"
    me: User
  }

  input UserRegistrationInput {
    "Unique username"
    username: String!

    "Unique email"
    email: String!

    firstName: String!
    lastName: String!

    password: String!
    passwordConfirmation: String!
  }

  type Mutation {
    "Login using email and password"
    login(email: String!, password: String!): User

    "Log out by clearing cookies"
    logout: Boolean!

    "Register a user"
    register(input: UserRegistrationInput!): User
  }
`;

export default user;
