import { gql } from "apollo-server-express";

const user = gql`
  "A member of the Mintbean platform"
  type PrivateUser {
    "User's ID in UUID"
    id: UUID!

    "Unique email"
    email: String!

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

  type PublicUser {
    "User's ID in UUID"
    id: UUID!

    firstName: String!
    lastName: String!

    "DateTime that the user registered"
    createdAt: DateTime!

    "DateTime that the user updated their profile"
    updatedAt: DateTime!
  }

  type Query {
    "Get a single user by ID"
    user(id: UUID, email: String): PublicUser

    "Get the current logged in user using cookies"
    me: PrivateUser
  }

  "The fields needed for a new user to register"
  input UserRegistrationInput {
    "Unique email"
    email: String!

    firstName: String!
    lastName: String!

    password: String!
    passwordConfirmation: String!
  }

  type Mutation {
    "Login using email and password"
    login(email: String!, password: String!): PrivateUser!

    "Log out by clearing cookies"
    logout: Boolean!

    "Register a user"
    register(input: UserRegistrationInput!): PrivateUser!
  }
`;

export default user;
