import { buildPersistenceContext, buildResolverContext, buildSchema, buildServer } from "./buildContext";
import express from "express";

const persistenceContext = buildPersistenceContext();
const resolverContext = buildResolverContext(persistenceContext);
const schema = buildSchema(resolverContext);
const server = buildServer(schema);
const app = express();

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));
