import buildServerContext from "./buildServerContext";
import express from "express";

const { server } = buildServerContext();
const app = express();

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
