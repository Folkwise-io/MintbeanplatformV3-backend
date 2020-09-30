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
import { MediaAsset, Meet, Project } from "../../src/types/gqlGeneratedTypes";
import { User } from "../../src/types/user";
import { Application } from "express";
import supertest, { Response, SuperTest, Test } from "supertest";
import setCookieParser, { Cookie } from "set-cookie-parser";
import ProjectMediaAsset from "../../src/types/projectMediaAsset";
import MeetRegistration from "../../src/types/meetRegistration";

interface TestManagerParams {
  persistenceContext: PersistenceContext;
  resolverContext: ResolverContext;
  schema: GraphQLSchema;
  testServer: ApolloServer;
  app: Application;
  testClient: SuperTest<Test>;
}

interface PostParams {
  query: DocumentNode;
  cookies?: string[];
  variables?: {
    [key: string]: any;
  };
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
    return this.params.persistenceContext.userDao.addMany(users).then(() => this);
  }

  addMeets(meets: Meet[]): Promise<TestManager> {
    return this.params.persistenceContext.meetDao.addMany(meets).then(() => this);
  }

  addProjects(projects: Project[]): Promise<TestManager> {
    return this.params.persistenceContext.projectDao.addMany(projects).then(() => this);
  }

  addMediaAssets(mediaAssets: MediaAsset[]): Promise<MediaAsset[]> {
    return this.params.persistenceContext.mediaAssetDao.addMany(mediaAssets);
  }

  addProjectMediaAssets(projectMediaAssets: ProjectMediaAsset[]): Promise<void> {
    return this.params.persistenceContext.projectMediaAssetDao.addMany(projectMediaAssets);
  }

  addMeetRegistrations(meetRegistrations: MeetRegistration[]): Promise<void>{
    return this.params.persistenceContext.meetRegistrationDao.addMany(meetRegistrations);
  }

  deleteAllUsers(): Promise<void> {
    return this.params.persistenceContext.userDao.deleteAll();
  }

  deleteAllMeets(): Promise<void> {
    return this.params.persistenceContext.meetDao.deleteAll();
  }

  deleteAllProjects(): Promise<void> {
    return this.params.persistenceContext.projectDao.deleteAll();
  }

  deleteAllMediaAssets() {
    return this.params.persistenceContext.mediaAssetDao.deleteAll();
  }

  deleteAllMeetRegistrations(){
    return this.params.persistenceContext.meetRegistrationDao.deleteAll();
  }

  getRawResponse({ query, cookies = [], variables }: PostParams): Promise<Response> {
    return this.params.testClient
      .post("/graphql")
      .set("Cookie", cookies)
      .send({ query: print(query), variables })
      .then((rawResponse) => rawResponse);
  }

  getCookies({ query, variables }: PostParams): Promise<string[]> {
    return this.getRawResponse({ query, variables }).then((rawResponse) => rawResponse.header["set-cookie"]);
  }

  parseCookies(rawResponse: Response): Cookie[] {
    return setCookieParser.parse(rawResponse.header["set-cookie"]);
  }

  parseGraphQLResponse(rawResponse: Response): GraphQLResponse {
    return JSON.parse(rawResponse.text);
  }

  // The GraphQL response is now sent as stringified json in rawResponse.text by supertest
  getGraphQLResponse({ query, cookies = [], variables }: PostParams): Promise<GraphQLResponse> {
    return this.getRawResponse({ query, cookies, variables }).then(this.parseGraphQLResponse);
  }

  parseData = (response: GraphQLResponse) => {
    // Q: Why did this need to be an arrow function?
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

  getErrorMessage(postParams: PostParams): Promise<string> {
    return this.getGraphQLResponse(postParams)
      .then(this.parseError)
      .then((error) => error.message);
  }

  getGraphQLData(postParams: PostParams) {
    return this.getGraphQLResponse(postParams).then(this.parseData);
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
