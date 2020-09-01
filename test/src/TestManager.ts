import { createTestClient } from "apollo-server-testing";
import buildServerContext from "../../src/buildServerContext";
import { Query } from "./createTestClient";
import { GraphQLResponse } from "apollo-server-types";

const { server: testServer } = buildServerContext(); // TODO: call buildTestServerContext to generate a test server with mocked daos
const { query, mutate } = createTestClient(testServer);

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
