import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `UUID` scalar type represents UUID values as specified by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};



export type User = {
  __typename?: 'User';
  /** User's ID in UUID */
  id: Scalars['UUID'];
  /** Unique username */
  username: Scalars['String'];
  /** Unique email */
  email: Scalars['String'];
  /** The user's hashed password */
  passwordHash: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  /** Timestamp that the user registered */
  createdAt: Scalars['DateTime'];
  /** Timestamp that the user updated their profile */
  updatedAt: Scalars['DateTime'];
  /** Whether the user has admin privileges to create/modify events */
  isAdmin: Scalars['Boolean'];
  /** A JWT created for the user after login (also sent in cookies) */
  token?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Maybe<Post>>>;
};

export type Query = {
  __typename?: 'Query';
  /** Search for users by first or last name */
  users?: Maybe<Array<Maybe<User>>>;
  /** Get a single user by ID, username, or email */
  user?: Maybe<User>;
  /** Get the current logged in user using cookies */
  me?: Maybe<User>;
  /** Search for posts by userId */
  posts?: Maybe<Array<Maybe<Post>>>;
  /** Get a single post by its ID */
  post?: Maybe<Post>;
  /** Gets all the meets in descending startTime order */
  meets?: Maybe<Array<Maybe<Meet>>>;
};


export type QueryUsersArgs = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['UUID']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};


export type QueryPostsArgs = {
  userId?: Maybe<Scalars['UUID']>;
};


export type QueryPostArgs = {
  id: Scalars['UUID'];
};

export type UserRegistrationInput = {
  /** Unique username */
  username: Scalars['String'];
  /** Unique email */
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Login using email and password */
  login?: Maybe<User>;
  /** Log out by clearing cookies */
  logout: Scalars['Boolean'];
  /** Register a user */
  register?: Maybe<User>;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  input: UserRegistrationInput;
};

export type Post = {
  __typename?: 'Post';
  /** ID of post in UUID */
  id: Scalars['UUID'];
  /** ID of the user who created the posted */
  userId: Scalars['UUID'];
  /** Unique username */
  body?: Maybe<Scalars['String']>;
  /** Date that the post was made */
  createdAt?: Maybe<Scalars['String']>;
  /** Date that the post was edited */
  updatedAt?: Maybe<Scalars['String']>;
  /** User who created the post */
  user?: Maybe<User>;
};

export type Meet = {
  __typename?: 'Meet';
  /** ID of the Meet in UUID */
  id: Scalars['UUID'];
  /** The type of the Meet as enum string. Only hackMeet is supported for now */
  meetType: Scalars['String'];
  title: Scalars['String'];
  /** A short blurb about the Meet */
  description: Scalars['String'];
  /** The instructions in markdown format */
  instructions: Scalars['String'];
  registerLink?: Maybe<Scalars['String']>;
  coverImageUrl: Scalars['String'];
  /** Wallclock times */
  startTime: Scalars['DateTime'];
  endTime: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  /** The IANA region used with wallclock time */
  region: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  UUID: ResolverTypeWrapper<Scalars['UUID']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  User: ResolverTypeWrapper<User>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Query: ResolverTypeWrapper<{}>;
  UserRegistrationInput: UserRegistrationInput;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  Meet: ResolverTypeWrapper<Meet>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  UUID: Scalars['UUID'];
  DateTime: Scalars['DateTime'];
  User: User;
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  Query: {};
  UserRegistrationInput: UserRegistrationInput;
  Mutation: {};
  Post: Post;
  Meet: Meet;
};

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  passwordHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType, RequireFields<QueryUsersArgs, never>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, never>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType, RequireFields<QueryPostsArgs, never>>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryPostArgs, 'id'>>;
  meets?: Resolver<Maybe<Array<Maybe<ResolversTypes['Meet']>>>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  login?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  register?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MeetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Meet'] = ResolversParentTypes['Meet']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  meetType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instructions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  registerLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  coverImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  region?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = any> = {
  UUID?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Meet?: MeetResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
