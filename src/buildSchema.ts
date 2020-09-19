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
import project from "./graphql/typedef/project";
import projectResolver from "./graphql/resolver/projectResolver";

export default function buildSchema(resolverContext: ResolverContext): GraphQLSchema {
  const {
    userService,
    userResolverValidator,
    meetResolverValidator,
    meetService,
    projectResolverValidator,
    projectService,
  } = resolverContext;
  const typeDefs = [customScalars, user, post, meet, project];
  const resolvers = [
    customScalarsResolver,
    userResolver(userResolverValidator, userService),
    meetResolver(meetResolverValidator, meetService),
    projectResolver(projectResolverValidator, projectService),
    postResolver,
  ];

  return makeExecutableSchema({
    typeDefs,
    resolvers: resolvers as any,
  });
}
