import { gql } from "apollo-server-express";

const customScalar = gql`
  scalar UUID
`;

export default customScalar;
