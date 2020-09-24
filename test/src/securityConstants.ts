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
