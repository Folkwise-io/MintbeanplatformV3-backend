// Only read by graphql-code-generator for generating TS types
import { buildPersistenceContext, buildServiceContext, buildSchema } from "../buildContext";

const persistenceContext = buildPersistenceContext();
const serviceContext = buildServiceContext(persistenceContext);
const schema = buildSchema(serviceContext);

export default schema;
