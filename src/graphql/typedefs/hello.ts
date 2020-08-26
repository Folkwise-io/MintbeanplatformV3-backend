import { gql } from "apollo-server-express";

export default gql`
  "Description of Hello"
  type Query {
    "Inner description of hello"
    hello: String
  }
`;
