import { createTestClient, ApolloServerTestClient } from "apollo-server-testing";
import {
  buildResolverContext,
  ResolverContext,
  buildPersistenceContext,
  buildSchema,
  buildServer,
  PersistenceContext,
} from "../../src/buildContext";
import { buildTestPersistenceContext } from "./dao/testPersistenceContextBuilder";
import { Query } from "./createTestClient";
import { GraphQLResponse } from "apollo-server-types";
import { TestState } from "./dao/TestState";
import { GraphQLSchema } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { User } from "../../src/graphql/generated/tsTypes";

interface TestManagerParams {
  state: TestState;
  persistenceContext: PersistenceContext;
  resolverContext: ResolverContext;
  schema: GraphQLSchema;
  testServer: ApolloServer;
  testClient: ApolloServerTestClient;
}

export default class TestManager {
  private state: TestState;
  private constructor(private params: TestManagerParams) {}

  static build(override: TestState = null) {
    const state: TestState = override || {
      users: [],
    };

    const persistenceContext = buildTestPersistenceContext(state);
    const resolverContext = buildResolverContext(persistenceContext);
    const schema = buildSchema(resolverContext);
    const testServer = buildServer(schema);
    const testClient = createTestClient(testServer);

    return new TestManager({
      state,
      persistenceContext,
      resolverContext,
      schema,
      testServer,
      testClient,
    });
  }

  addUsers(...users: User[]) {
    users.forEach((u) => this.state.users.push(u));
    return this;
  }

  async query(gqlQuery: Query): Promise<GraphQLResponse> {
    return await this.params.testClient.query(gqlQuery);
  }

  async printQueryResults(gqlQuery: Query): Promise<void> {
    const results = await this.query(gqlQuery);

    // Pretty-print the response object
    console.log(JSON.stringify(results, null, 2));
  }
}
