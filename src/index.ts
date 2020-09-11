import express from "express";
import { buildPersistenceContext, buildResolverContext, buildExpressServerContext } from "./buildContext";
import buildSchema from "./buildSchema";
import buildServer from "./buildServer";

const persistenceContext = buildPersistenceContext();
const resolverContext = buildResolverContext(persistenceContext);
const schema = buildSchema(resolverContext);
const server = buildServer(schema, buildExpressServerContext);
const app = express();

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));
