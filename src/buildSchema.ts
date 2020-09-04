import { makeExecutableSchema } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import customScalarsResolver from "./graphql/resolver/customScalarsResolver";
import userResolver from "./graphql/resolver/userResolver";
import postResolver from "./graphql/resolver/postResolver";
import user from "./graphql/typedef/user";
import post from "./graphql/typedef/post";
import customScalars from "./graphql/typedef/customScalars";
import { ResolverContext } from "./buildContext";

export default function buildSchema(resolverContext: ResolverContext): GraphQLSchema {
  const { userService, userResolverValidator } = resolverContext;
  const typeDefs = [customScalars, user, post];
  const resolvers = [customScalarsResolver, userResolver(userResolverValidator, userService), postResolver];

  return makeExecutableSchema({
    typeDefs,
    resolvers: resolvers as any,
  });
}
