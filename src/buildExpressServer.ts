import { ApolloServer } from "apollo-server-express";
import express from "express";
import cookieParser from "cookie-parser";

export default function buildExpressServer(apolloServer: ApolloServer) {
  const app = express();
  app.use(cookieParser());
  apolloServer.applyMiddleware({ app });
  return app;
}
