import { createTestClient } from "apollo-server-testing";
import server from "../../src/server";
import { Query } from "./createTestClient";
import { GraphQLResponse } from "apollo-server-types";
const { query, mutate } = createTestClient(server);

export default class TestManager {
  /**
   * Wrapper for original apollo-server-testing query function.
   * @param gqlQuery The GraphQL query
   */
  async query(gqlQuery: Query): Promise<GraphQLResponse> {
    return await query(gqlQuery);
  }

  /**
   * Queries server and pretty-prints the raw query response to console for
     debugging / dev purposes.
   * @param gqlQuery The GraphQL query
   */
  async printQueryResults(gqlQuery: Query): Promise<void> {
    const results = await this.query(gqlQuery);

    // Pretty-print the response object
    console.log(JSON.stringify(results, null, 2));
  }
}
