import { makeExecutableSchema } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import customScalarsResolver from "./graphql/resolver/customScalarsResolver";
import userResolver from "./graphql/resolver/userResolver";
import postResolver from "./graphql/resolver/postResolver";
import user from "./graphql/typedef/user";
import post from "./graphql/typedef/post";
import customScalars from "./graphql/typedef/customScalars";
import { ResolverContext } from "./buildContext";
import meet from "./graphql/typedef/meet";
import meetResolver from "./graphql/resolver/meetResolver";

export default function buildSchema(resolverContext: ResolverContext): GraphQLSchema {
  const { userService, userResolverValidator, meetResolverValidator, meetService } = resolverContext;
  const typeDefs = [customScalars, user, post, meet];
  const resolvers = [
    customScalarsResolver,
    userResolver(userResolverValidator, userService),
    meetResolver(meetResolverValidator, meetService),
    postResolver,
  ];

  return makeExecutableSchema({
    typeDefs,
    resolvers: resolvers as any,
  });
}
