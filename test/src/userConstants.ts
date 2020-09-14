import { gql } from "apollo-server-express";
import { User } from "../../src/types/gqlGeneratedTypes";

// Will use generator factory / faker once more entities are added
export const AMY: User = {
  id: "00000000-0000-0000-0000-000000000000",
  username: "aadams",
  email: "a@a.com",
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: "Amy",
  lastName: "Adams",
  createdAt: "2019-10-15",
};

export const BOB: User = {
  id: "00000000-0000-4000-A000-000000000000",
  username: "bbarker",
  email: "b@b.com",
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: "Bob",
  lastName: "Barker",
  createdAt: "2020-04-15",
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

export const LOGIN_MUTATION_CORRECT = gql`
  mutation correctLogin {
    login(email: "a@a.com", password: "password") {
      id
      username
    }
  }
`;

export const LOGIN_MUTATION_INCORRECT_PASSWORD = gql`
  mutation wrongPassword {
    login(email: "a@a.com", password: "wrongpassword") {
      id
      username
    }
  }
`;

export const LOGIN_MUTATION_NO_PASSWORD = gql`
  mutation noPassword {
    login(email: "a@a.com") {
      id
      username
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

export const LOGIN_MUTATION_NO_EMAIL = gql`
  mutation noEmail {
    login(password: "password") {
      id
      username
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
