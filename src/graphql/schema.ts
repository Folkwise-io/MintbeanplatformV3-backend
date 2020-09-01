// Only read by graphql-code-generator for generating TS types
import { buildPersistenceContext, buildResolverContext, buildSchema } from "../buildContext";

const persistenceContext = buildPersistenceContext();
const resolverContext = buildResolverContext(persistenceContext);
const schema = buildSchema(resolverContext);

export default schema;
