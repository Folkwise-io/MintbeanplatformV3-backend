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
import mediaAsset from "./graphql/typedef/mediaAsset";
import mediaAssetResolver from "./graphql/resolver/mediaAssetResolver";
import meetRegistration from "./graphql/typedef/meetRegistration";
import kanban from "./graphql/typedef/kanban";
import kanbanResolver from "./graphql/resolver/kanbanResolver";
import kanbanCard from "./graphql/typedef/kanbanCard";
import kanbanCardResolver from "./graphql/resolver/kanbanCardResolver";
import kanbanSession from "./graphql/typedef/kanbanSession";
import kanbanSessionResolver from "./graphql/resolver/kanbanSessionResolver";

export default function buildSchema(resolverContext: ResolverContext): GraphQLSchema {
  const {
    userService,
    userResolverValidator,
    meetResolverValidator,
    meetService,
    projectResolverValidator,
    projectService,
    mediaAssetResolverValidator,
    mediaAssetService,
    projectMediaAssetService,
    meetRegistrationService,
    kanbanResolverValidator,
    kanbanService,
    kanbanCardResolverValidator,
    kanbanCardService,
    kanbanSessionResolverValidator,
    kanbanSessionService,
  } = resolverContext;
  const typeDefs = [
    customScalars,
    user,
    post,
    meet,
    project,
    mediaAsset,
    meetRegistration,
    kanban,
    kanbanCard,
    kanbanSession,
  ];
  const resolvers = [
    customScalarsResolver,
    userResolver(userResolverValidator, userService),
    meetResolver(meetResolverValidator, meetService, meetRegistrationService),
    projectResolver(projectResolverValidator, projectService, mediaAssetService, projectMediaAssetService),
    mediaAssetResolver(mediaAssetResolverValidator, mediaAssetService),
    kanbanResolver(kanbanResolverValidator, kanbanService),
    kanbanCardResolver(kanbanCardResolverValidator, kanbanCardService),
    kanbanSessionResolver(kanbanSessionResolverValidator, kanbanSessionService),
    postResolver,
  ];

  return makeExecutableSchema({
    typeDefs,
    resolvers: resolvers as any,
  });
}
