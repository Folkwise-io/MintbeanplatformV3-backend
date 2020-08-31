import { gql } from "apollo-server-express";
import { DocumentNode } from "graphql";

const customScalar: DocumentNode = gql`
  scalar UUID
`;

export default customScalar;
