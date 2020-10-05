import { gql } from "apollo-server-express";

const email = gql`
  extend type Mutation {
    sendTestEmail: Boolean!
  }
`;

export default email;
