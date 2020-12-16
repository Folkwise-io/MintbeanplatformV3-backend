import { buildPersistenceContext, buildResolverContext } from "./buildContext";
import { buildExpressServerContext } from "./buildServerContext";
import buildSchema from "./buildSchema";
import buildApolloServer from "./buildApolloServer";
import buildExpressServer from "./buildExpressServer";
import moment from "moment-timezone";

const persistenceContext = buildPersistenceContext();
const resolverContext = buildResolverContext(persistenceContext);
const schema = buildSchema(resolverContext);
const apolloServer = buildApolloServer(schema, buildExpressServerContext);
const app = buildExpressServer(apolloServer);

app.locals.moment = moment; // make moment available in ejs templates

app.listen({ port: 4000 }, () => console.log(`Server ready at http://localhost:4000${apolloServer.graphqlPath}`));
