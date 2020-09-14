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
import { GraphQLResponse } from "apollo-server-types";
import { DocumentNode, GraphQLSchema, print } from "graphql";
import { ApolloServer } from "apollo-server-express";
import { User } from "../../src/types/gqlGeneratedTypes";
import { Application } from "express";
import supertest, { Response, SuperTest, Test } from "supertest";
import setCookieParser from "set-cookie-parser";

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

  getRawResponse(gqlQuery: DocumentNode): Promise<Response> {
    return this.params.testClient
      .post("/graphql")
      .send({ query: print(gqlQuery) })
      .then((rawResponse) => rawResponse);
  }

  parseCookies(rawResponse: Response) {
    return setCookieParser.parse(rawResponse.header["set-cookie"]);
  }

  parseGraphQLResponse(rawResponse: Response): GraphQLResponse {
    return JSON.parse(rawResponse.text);
  }

  // The GraphQL response is now sent as stringified json in rawResponse.text by supertest
  getGraphQLResponse(gqlQuery: DocumentNode): Promise<GraphQLResponse> {
    return this.getRawResponse(gqlQuery).then(this.parseGraphQLResponse);
  }

  parseData(response: GraphQLResponse) {
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
  }

  parseError(response: GraphQLResponse) {
    if (!response.errors) {
      throw new Error("Test expected an error but did not get any");
    }
    return response.errors[0];
  }

  parseAllErrors(response: GraphQLResponse) {
    if (!response.errors) {
      throw new Error("Test expected an error but did not get any");
    }
    return response.errors;
  }

  parseDataAndErrors({ data, errors }: GraphQLResponse) {
    if (!data || !errors) {
      throw new Error("Test expected both a data and error but did not get them");
    }
    return { data, errors };
  }

  // Needed for debugging because console.log would just give you "[object]"
  logResponse<T>(response: T): T {
    console.log(JSON.stringify(response, null, 2));
    return response;
  }

  destroy(): Promise<void> {
    return this.params.persistenceContext.userDao.destroy();
  }
}
