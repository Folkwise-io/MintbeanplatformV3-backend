import { createTestClient, ApolloServerTestClient } from "apollo-server-testing";
import {
  buildResolverContext,
  ResolverContext,
  PersistenceContext,
  buildPersistenceContext,
} from "../../src/buildContext";
import buildSchema from "../../src/buildSchema";
import buildServer from "../../src/buildServer";
import { Query } from "./createTestClient";
import { GraphQLResponse } from "apollo-server-types";
import { GraphQLSchema } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { User } from "../../src/graphql/generated/tsTypes";

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
    const testServer = buildServer(schema);
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

  getData = (response: GraphQLResponse) => {
    if (response.errors) {
      this.printJson(response);
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

  printJson(json: object): void {
    console.log(JSON.stringify(json, null, 2));
  }

  destroy(): Promise<void> {
    return this.params.persistenceContext.knex.destroy();
  }
}
