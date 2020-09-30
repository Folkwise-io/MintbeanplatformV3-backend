import { gql } from "apollo-server-express";

export const FIVE_LEVEL_NESTED_QUERY = gql`
  query fiveLevelNestedQuery {
    meets {
      projects {
        meet {
          projects {
            meet {
              id
            }
          }
        }
      }
    }
  }
`;

export const USER_PASSWORDHASH_QUERY = gql`
  query userWithPasswordHash($id: UUID!) {
    user(id: $id) {
      id
      firstName
      lastName
      passwordHash
    }
  }
`;

export const PROJECT_NESTED_PASSWORDHASH_QUERY = gql`
  query nestedUserWithPasswordHash($id: UUID!) {
    project(id: $id) {
      title
      user {
        passwordHash
      }
    }
  }
`;

export const USER_EMAIL_QUERY = gql`
  query userWithEmail($id: UUID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const PROJECT_NESTED_EMAIL_QUERY = gql`
  query nestedUserWithEmail($id: UUID!) {
    project(id: $id) {
      title
      user {
        email
      }
    }
  }
`;

export const LOGIN_PASSWORDHASH = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      firstName
      id
      email
      passwordHash
    }
  }
`;
