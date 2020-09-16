import { gql } from "apollo-server-express";

const customScalar = gql`
  scalar UUID
  scalar DateTime
`;

export default customScalar;
