import { ApolloServer } from "apollo-server-express";
import express, { Application } from "express";
import cookieParser from "cookie-parser";

export default function buildExpressServer(apolloServer: ApolloServer): Application {
  const app = express();
  app.use(cookieParser());
  apolloServer.applyMiddleware({ app });
  return app;
}
