import { createTestClient, ApolloServerTestClient } from "apollo-server-testing";
import {
  buildResolverContext,
  ResolverContext,
  PersistenceContext,
  buildPersistenceContext,
} from "../../src/buildContext";
import buildSchema from "../../src/buildSchema";
import buildApolloServer from "../../src/buildApolloServer";
import { Query, Mutation } from "./createTestClient";
import { GraphQLResponse } from "apollo-server-types";
import { GraphQLSchema } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { User } from "../../src/types/gqlGeneratedTypes";
import { buildTestServerContext } from "./buildTestServerContext";

interface TestManagerParams {
  persistenceContext: PersistenceContext;
  resolverContext: ResolverContext;
  schema: GraphQLSchema;
  testServer: ApolloServer;
  testClient: ApolloServerTestClient;
}

export default class TestManager {
  private constructor(private params: TestManagerParams) {}

  static build() {
    const persistenceContext = buildPersistenceContext();
    const resolverContext = buildResolverContext(persistenceContext);
    const schema = buildSchema(resolverContext);
    const testServer = buildApolloServer(schema, buildTestServerContext);
    const testClient = createTestClient(testServer);

    return new TestManager({
      persistenceContext,
      resolverContext,
      schema,
      testServer,
      testClient,
    });
  }

  addUsers(users: User[]): Promise<TestManager> {
    return this.params.persistenceContext.userDao.addUsers(users).then(() => this);
  }

  deleteAllUsers(): Promise<void> {
    return this.params.persistenceContext.userDao.deleteAll();
  }

  query(gqlQuery: Query): Promise<GraphQLResponse> {
    return this.params.testClient.query(gqlQuery);
  }

  mutate(gqlMutation: Mutation): Promise<GraphQLResponse> {
    return this.params.testClient.mutate(gqlMutation);
  }

  getData = (response: GraphQLResponse) => {
    if (response.errors) {
      this.logResponse(response);
      throw new Error("Test expected data but got an error");
    }

    // These conditional errors help with typing in the tests file
    // For example, when accessing response.data.user without the conditional below, it will complain
    if (!response.data) {
      throw new Error("Test expected data but received no data");
    }
    return response.data;
  };

  getError = (response: GraphQLResponse) => {
    if (!response.errors) {
      throw new Error("Test expected an error but did not get any");
    }
    return response.errors[0];
  };

  getAllErrors = (response: GraphQLResponse) => {
    if (!response.errors) {
      throw new Error("Test expected an error but did not get any");
    }
    return response.errors;
  };

  getDataAndErrors = ({ data, errors }: GraphQLResponse) => {
    if (!data || !errors) {
      throw new Error("Test expected both a data and error but did not get them");
    }
    return { data, errors };
  };

  // Needed for debugging because console.log would just give you "[object]"
  logResponse(response: GraphQLResponse): GraphQLResponse {
    console.log(JSON.stringify(response, null, 2));
    return response;
  }

  destroy(): Promise<void> {
    return this.params.persistenceContext.userDao.destroy();
  }
}
