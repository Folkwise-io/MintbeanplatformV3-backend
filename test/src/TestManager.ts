import {
  buildResolverContext,
  ResolverContext,
  PersistenceContext,
  buildPersistenceContext,
} from "../../src/buildContext";
import buildSchema from "../../src/buildSchema";
import { buildExpressServerContext } from "../../src/buildServerContext";
import buildApolloServer from "../../src/buildApolloServer";
import buildExpressServer from "../../src/buildExpressServer";
import { Query, Mutation } from "./createTestClient";
import { GraphQLResponse } from "apollo-server-types";
import { DocumentNode, GraphQLSchema, print } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { User } from "../../src/types/gqlGeneratedTypes";
import { Application } from "express";
import supertest, { SuperTest, Test } from "supertest";

interface TestManagerParams {
  persistenceContext: PersistenceContext;
  resolverContext: ResolverContext;
  schema: GraphQLSchema;
  testServer: ApolloServer;
  app: Application;
  testClient: SuperTest<Test>;
}

export default class TestManager {
  private constructor(private params: TestManagerParams) {}

  static build() {
    const persistenceContext = buildPersistenceContext();
    const resolverContext = buildResolverContext(persistenceContext);
    const schema = buildSchema(resolverContext);
    const testServer = buildApolloServer(schema, buildExpressServerContext);
    const app = buildExpressServer(testServer);
    const testClient = supertest(app);

    return new TestManager({
      persistenceContext,
      resolverContext,
      schema,
      testServer,
      app,
      testClient,
    });
  }

  addUsers(users: User[]): Promise<TestManager> {
    return this.params.persistenceContext.userDao.addUsers(users).then(() => this);
  }

  deleteAllUsers(): Promise<void> {
    return this.params.persistenceContext.userDao.deleteAll();
  }

  query(gqlQuery: DocumentNode): Promise<GraphQLResponse> {
    return this.params.testClient
      .post("/graphql")
      .send({ query: print(gqlQuery) })
      .then((response) => JSON.parse(response.text));
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
