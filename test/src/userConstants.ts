import { gql } from "apollo-server-express";
import { User, UserRegistrationInput } from "../../src/types/gqlGeneratedTypes";

// Will use generator factory / faker once more entities are added
export const AMY = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "a@a.com",
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: "Amy",
  lastName: "Adams",
  createdAt: "2019-10-15",
  updatedAt: "2019-10-15",
  isAdmin: true,
};

export const AMY_CREDENTIALS = {
  email: "a@a.com",
  password: "password",
};

export const BOB = {
  id: "00000000-0000-4000-a000-000000000000",
  email: "b@b.com",
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: "Bob",
  lastName: "Barker",
  createdAt: "2020-04-15",
  updatedAt: "2020-04-15",
  isAdmin: false,
};

export const BOB_CREDENTIALS = {
  email: "b@b.com",
  password: "password",
};

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
      firstName
      id
    }
  }
`;

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
    }
  }
`;

export const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

export const NEW_USER_INPUT: UserRegistrationInput = {
  email: "d@d.com",
  firstName: "Danny",
  lastName: "DeVito",
  password: "password",
  passwordConfirmation: "password",
};

export const REGISTER = gql`
  mutation register($input: UserRegistrationInput!) {
    register(input: $input) {
      id
      firstName
      lastName
      isAdmin
    }
  }
`;
