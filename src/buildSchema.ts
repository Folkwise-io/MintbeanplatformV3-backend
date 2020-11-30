import { makeExecutableSchema } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import customScalarsResolver from "./graphql/resolver/customScalarsResolver";
import userResolver from "./graphql/resolver/userResolver";
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
import email from "./graphql/typedef/email";
import emailResolver from "./graphql/resolver/emailResolver";
import badge from "./graphql/typedef/badge";
import badgeResolver from "./graphql/resolver/badgeResolver";
import kanbanCanon from "./graphql/typedef/kanbanCanon";
import kanbanCanonResolver from "./graphql/resolver/kanbanCanonResolver";
import kanbanCanonCard from "./graphql/typedef/kanbanCanonCard";
import kanbanCanonCardResolver from "./graphql/resolver/kanbanCanonCardResolver";
import kanban from "./graphql/typedef/kanban";
import kanbanResolver from "./graphql/resolver/kanbanResolver";
import kanbanCardResolver from "./graphql/resolver/kanbanCardResolver";

export default function buildSchema(resolverContext: ResolverContext): GraphQLSchema {
  const {
    userService,
    userResolverValidator,
    meetResolverValidator,
    meetService,
    projectResolverValidator,
    emailResolverValidator,
    emailService,
    badgeResolverValidator,
    badgeService,
    badgeProjectDao,
    badgeProjectService,
    kanbanCanonService,
    kanbanCanonResolverValidator,
    kanbanCanonCardService,
    kanbanCanonCardResolverValidator,
    kanbanService,
    kanbanResolverValidator,
    kanbanCanonCardDao,
    kanbanCanonDao,
    kanbanDao,
    mediaAssetDao,
    meetRegistrationDao,
    meetDao,
    projectMediaAssetDao,
    projectDao,
    userDao,
  } = resolverContext;
  const typeDefs = [
    customScalars,
    user,
    post,
    meet,
    project,
    mediaAsset,
    meetRegistration,
    email,
    badge,
    kanbanCanon,
    kanbanCanonCard,
    kanban,
  ];
  const resolvers = [
    customScalarsResolver,
    userResolver(userResolverValidator, userService, userDao),
    meetResolver(meetResolverValidator, meetService, meetRegistrationDao, userDao, emailService, meetDao),
    projectResolver(
      projectResolverValidator,
      projectDao,
      mediaAssetDao,
      projectMediaAssetDao,
      badgeProjectDao,
      badgeProjectService,
    ),
    mediaAssetResolver(mediaAssetDao),
    emailResolver(emailResolverValidator, emailService, meetDao),
    badgeResolver(badgeResolverValidator, badgeService),
    kanbanCanonResolver(kanbanCanonResolverValidator, kanbanCanonService, kanbanCanonDao),
    kanbanCanonCardResolver(kanbanCanonCardResolverValidator, kanbanCanonCardService, kanbanCanonCardDao),
    kanbanResolver(kanbanResolverValidator, kanbanService, kanbanDao),
    kanbanCardResolver(kanbanCanonCardDao),
  ];

  return makeExecutableSchema({
    typeDefs,
    resolvers: resolvers as any,
  });
}
