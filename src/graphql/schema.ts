// Only read by graphql-code-generator for generating a TS types file
import { buildPersistenceContext, buildResolverContext } from "../buildContext";
import buildSchema from "../buildSchema";

const persistenceContext = buildPersistenceContext();
const resolverContext = buildResolverContext(persistenceContext);
const schema = buildSchema(resolverContext);

export default schema;
