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
import email from "./graphql/typedef/email";
import emailResolver from "./graphql/resolver/emailResolver";
import badge from "./graphql/typedef/badge";
import badgeResolver from "./graphql/resolver/badgeResolver";

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
    emailResolverValidator,
    emailService,
    badgeResolverValidator,
    badgeService,
  } = resolverContext;
  const typeDefs = [customScalars, user, post, meet, project, mediaAsset, meetRegistration, email, badge];
  const resolvers = [
    customScalarsResolver,
    userResolver(userResolverValidator, userService),
    meetResolver(meetResolverValidator, meetService, meetRegistrationService, userService, emailService),
    projectResolver(projectResolverValidator, projectService, mediaAssetService, projectMediaAssetService),
    mediaAssetResolver(mediaAssetResolverValidator, mediaAssetService),
    emailResolver(emailResolverValidator, emailService, meetService),
    postResolver,
    badgeResolver(badgeResolverValidator, badgeService),
  ];

  return makeExecutableSchema({
    typeDefs,
    resolvers: resolvers as any,
  });
}
