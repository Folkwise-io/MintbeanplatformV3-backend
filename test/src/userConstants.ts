import { gql } from "apollo-server-express";
import { UserRegistrationInput } from "../../src/types/gqlGeneratedTypes";
import { User } from "../../src/types/User";

// Will use generator factory / faker once more entities are added
export const AMY: User = {
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

export const BOB: User = {
  id: "00000000-0000-4000-a000-000000000000",
  email: "b@b.com",
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: "Bob",
  lastName: "Barker",
  createdAt: "2020-04-15",
  updatedAt: "2020-04-15",
  isAdmin: false,
};

export const DORTHY: User = {
  id: "93808c2d-0297-45ec-84b5-a19ce790830a",
  email: "d@d.com",
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: "Dorthy",
  lastName: "Danes",
  createdAt: "2020-04-15",
  updatedAt: "2020-04-15",
  isAdmin: false,
};

export const BOB_CREDENTIALS = {
  email: "b@b.com",
  password: "password",
};

export const GET_USER_QUERY = gql`
  query getOneUser($id: UUID!) {
    user(id: $id) {
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
      email
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
