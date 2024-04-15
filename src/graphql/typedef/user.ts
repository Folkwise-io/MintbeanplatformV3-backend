import { gql } from "apollo-server-express";

const user = gql`
  "A private user entity that is only returned in authenticated routes, which contains fields that are private"
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

  "A public user entity whose fields should all be public information"
  type PublicUser {
    "User's ID in UUID"
    id: UUID!

    firstName: String!
    lastName: String!

    "Whether the user has admin privileges to create/modify events"
    isAdmin: Boolean!

    "DateTime that the user registered"
    createdAt: DateTime!

    "DateTime that the user updated their profile"
    updatedAt: DateTime!
  }

  type Query {
    "Get a single user by ID"
    user(id: UUID!): PublicUser

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

  "The fields supported for editing a user"
  input EditUserInput {
    "User first name"
    firstName: String
    "User last name"
    lastName: String
  }

  type Mutation {
    "Login using email and password"
    login(email: String!, password: String!): PrivateUser!

    "Log out by clearing cookies"
    logout: Boolean!

    "Register a user"
    register(input: UserRegistrationInput!): PrivateUser!

    "Edit a user by id"
    editUser(id: UUID!, input: EditUserInput!): PrivateUser!
  }
`;

export default user;
