import { createTestClient, ApolloServerTestClient } from "apollo-server-testing";
import {
  buildResolverContext,
  ResolverContext,
  buildSchema,
  buildServer,
  PersistenceContext,
} from "../../src/buildContext";
import { buildTestPersistenceContext } from "./buildTestPersistenceContext";
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
  private constructor(private params: TestManagerParams) {}

  static build(initialState?: TestState) {
    const state: TestState = initialState || {
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
    users.forEach((u) => this.params.state.users.push(u));
    return this;
  }

  async query(gqlQuery: Query): Promise<GraphQLResponse> {
    return await this.params.testClient.query(gqlQuery);
  }

  getData = (response: GraphQLResponse) => {
    if (response.errors) {
      this.printObj(response);
      throw new Error("Test expected data but got an error");
    }
    if (!response.data) {
      throw new Error("Test expected data but received no data");
    }
    return response.data;
  };

  getErrors = (response: GraphQLResponse) => {
    if (!response.errors) {
      throw new Error("Test expected an error but did not get any");
    }
    return response.errors;
  };

  printObj(result: object): void {
    console.log(JSON.stringify(result, null, 2));
  }
}
