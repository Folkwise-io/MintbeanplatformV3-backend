import { gql } from "apollo-server-express";
import { User, UserRegistrationInput } from "../../src/types/gqlGeneratedTypes";

// Will use generator factory / faker once more entities are added
export const AMY: User = {
  id: "00000000-0000-0000-0000-000000000000",
  username: "aadams",
  email: "a@a.com",
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: "Amy",
  lastName: "Adams",
  createdAt: "2019-10-15",
  updatedAt: "2019-10-15",
  isAdmin: false,
};

export const BOB: User = {
  id: "00000000-0000-4000-A000-000000000000",
  username: "bbarker",
  email: "b@b.com",
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: "Bob",
  lastName: "Barker",
  createdAt: "2020-04-15",
  updatedAt: "2020-04-15",
  isAdmin: false,
};

export const BAD_USERNAME_QUERY = gql`
  query badUserName {
    user(username: 5) {
      firstName
      lastName
    }
  }
`;
export const BAD_UUID_QUERY = gql`
  query badUserId {
    user(id: "000000") {
      firstName
      lastName
    }
  }
`;

export const GET_ONE_QUERY = gql`
  query getOneUser {
    user(id: "00000000-0000-0000-0000-000000000000") {
      firstName
      lastName
    }
  }
`;

export const GET_ALL_USERS_QUERY = gql`
  query getAllUsers {
    users {
      firstName
      lastName
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      username
    }
  }
`;

export const AMY_CREDENTIALS = {
  email: "a@a.com",
  password: "password",
};

export const LOGIN_MUTATION_WITH_TOKEN = gql`
  mutation correctLogin {
    login(email: "a@a.com", password: "password") {
      token
    }
  }
`;

export const ME_QUERY = gql`
  query me {
    me {
      id
      username
    }
  }
`;

export const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

export const registerInput: UserRegistrationInput = {
  username: "ddevito",
  email: "d@d.com",
  firstName: "Danny",
  lastName: "DeVito",
  password: "password",
  passwordConfirmation: "password",
};

export const REGISTER = gql`
  mutation register($input: UserRegistrationInput) {
    register(input: $input) {
      id
      username
      firstName
      lastName
      isAdmin
    }
  }
`;
