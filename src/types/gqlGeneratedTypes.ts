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



/** A private user entity that is only returned in authenticated routes, which contains fields that are private */
export type PrivateUser = {
  __typename?: 'PrivateUser';
  /** User's ID in UUID */
  id: Scalars['UUID'];
  /** Unique email */
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  /** DateTime that the user registered */
  createdAt: Scalars['DateTime'];
  /** DateTime that the user updated their profile */
  updatedAt: Scalars['DateTime'];
  /** Whether the user has admin privileges to create/modify events */
  isAdmin: Scalars['Boolean'];
  /** A JWT created for the user after login (also sent in cookies) */
  token?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  /** All the projects that the user has submitted */
  projects?: Maybe<Array<Project>>;
  /** A list of meets that the user has registered for */
  registeredMeets?: Maybe<Array<Meet>>;
};

/** A public user entity whose fields should all be public information */
export type PublicUser = {
  __typename?: 'PublicUser';
  /** User's ID in UUID */
  id: Scalars['UUID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  /** Whether the user has admin privileges to create/modify events */
  isAdmin: Scalars['Boolean'];
  /** DateTime that the user registered */
  createdAt: Scalars['DateTime'];
  /** DateTime that the user updated their profile */
  updatedAt: Scalars['DateTime'];
  posts?: Maybe<Array<Maybe<Post>>>;
  /** All the projects that the user has submitted */
  projects?: Maybe<Array<Project>>;
  /** A list of meets that the user has registered for */
  registeredMeets?: Maybe<Array<Meet>>;
};

export type Query = {
  __typename?: 'Query';
  /** Get a single user by ID */
  user?: Maybe<PublicUser>;
  /** Get the current logged in user using cookies */
  me?: Maybe<PrivateUser>;
  /** Search for posts by userId */
  posts?: Maybe<Array<Maybe<Post>>>;
  /** Get a single post by its ID */
  post?: Maybe<Post>;
  /** Get a meet by ID */
  meet?: Maybe<Meet>;
  /** Gets all the meets in descending startTime order */
  meets?: Maybe<Array<Maybe<Meet>>>;
  /** Search for projects by userId or meetID */
  projects?: Maybe<Array<Maybe<Project>>>;
  /** Get a single project by its ID */
  project?: Maybe<Project>;
  /** Gets all the badges */
  badges?: Maybe<Array<Maybe<Badge>>>;
  /** gets one badge by id or alias */
  badge?: Maybe<Badge>;
};


export type QueryUserArgs = {
  id: Scalars['UUID'];
};


export type QueryPostsArgs = {
  userId?: Maybe<Scalars['UUID']>;
};


export type QueryPostArgs = {
  id: Scalars['UUID'];
};


export type QueryMeetArgs = {
  id: Scalars['UUID'];
};


export type QueryProjectsArgs = {
  userId?: Maybe<Scalars['UUID']>;
  meetId?: Maybe<Scalars['UUID']>;
};


export type QueryProjectArgs = {
  id: Scalars['UUID'];
};


export type QueryBadgeArgs = {
  badgeId: Scalars['UUID'];
};

/** The fields needed for a new user to register */
export type UserRegistrationInput = {
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
  login: PrivateUser;
  /** Log out by clearing cookies */
  logout: Scalars['Boolean'];
  /** Register a user */
  register: PrivateUser;
  /** Creates a new meet (only hackMeet is supported for now) */
  createMeet: Meet;
  /** Edits a meet (requires admin privileges) */
  editMeet: Meet;
  /** Deletes a meet (requires admin privileges) */
  deleteMeet: Scalars['Boolean'];
  /** Creates a new project (must be logged in) */
  createProject: Project;
  /** Deletes a project by ID (user must be logged in and own the project) */
  deleteProject: Scalars['Boolean'];
  /** Registers the current logged-in user for a meet. */
  registerForMeet: Scalars['Boolean'];
  /** Sends a test email (admin-only) */
  sendTestEmail: Scalars['Boolean'];
  /** Sends a reminder email to registrants of a meet (admin-only) */
  sendReminderEmailForMeet: Scalars['Boolean'];
  /** Sends a sample registration email with json-ld for Google whitelist approval (admin-only) */
  sendSampleRegistrationEmailForMeet: Scalars['Boolean'];
  /** Creates a new badge (requires admin privileges */
  createBadge: Badge;
  /** Edits a badge (requires admin privileges) */
  editBadge: Badge;
  /** Deletes a badge (requires admin privileges) */
  deleteBadge: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  input: UserRegistrationInput;
};


export type MutationCreateMeetArgs = {
  input: CreateMeetInput;
};


export type MutationEditMeetArgs = {
  id: Scalars['UUID'];
  input: EditMeetInput;
};


export type MutationDeleteMeetArgs = {
  id: Scalars['UUID'];
};


export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationDeleteProjectArgs = {
  id: Scalars['UUID'];
};


export type MutationRegisterForMeetArgs = {
  meetId: Scalars['UUID'];
};


export type MutationSendTestEmailArgs = {
  input: TestEmailInput;
};


export type MutationSendReminderEmailForMeetArgs = {
  input: MeetReminderEmailInput;
};


export type MutationSendSampleRegistrationEmailForMeetArgs = {
  meetId: Scalars['UUID'];
};


export type MutationCreateBadgeArgs = {
  input: CreateBadgeInput;
};


export type MutationEditBadgeArgs = {
  badgeId: Scalars['UUID'];
  input: EditBadgeInput;
};


export type MutationDeleteBadgeArgs = {
  badgeId: Scalars['UUID'];
};

export type Post = {
  __typename?: 'Post';
  /** ID of post in UUID */
  id: Scalars['UUID'];
  /** ID of the user who created the posted */
  userId: Scalars['UUID'];
  /** Post body */
  body?: Maybe<Scalars['String']>;
  /** Date that the post was made */
  createdAt?: Maybe<Scalars['String']>;
  /** Date that the post was edited */
  updatedAt?: Maybe<Scalars['String']>;
  /** User who created the post */
  user?: Maybe<PublicUser>;
};

/** Whether registration is going to open, is open now, or is closed. */
export enum RegisterLinkStatus {
  Waiting = 'WAITING',
  Open = 'OPEN',
  Closed = 'CLOSED'
}

/** An event hosted by Mintbean. Only Hack Meets exist for now but will include workshops etc. in the future */
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
  registerLinkStatus?: Maybe<RegisterLinkStatus>;
  coverImageUrl: Scalars['String'];
  /** Wallclock times */
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  /** DateTime that the meet was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the meet was modified */
  updatedAt: Scalars['DateTime'];
  /** The IANA region used with wallclock time */
  region: Scalars['String'];
  /** All the projects that are associated with the Meet */
  projects?: Maybe<Array<Project>>;
  /** A list of users that are registered for the Meet */
  registrants?: Maybe<Array<PublicUser>>;
};

/** The input needed to create a new meet */
export type CreateMeetInput = {
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
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  /** The IANA region used with wallclock time */
  region: Scalars['String'];
};

/** Input that can be used to edit a meet - all fields are optional */
export type EditMeetInput = {
  /** The type of the Meet as enum string. Only hackMeet is supported for now */
  meetType?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  /** A short blurb about the Meet */
  description?: Maybe<Scalars['String']>;
  /** The instructions in markdown format */
  instructions?: Maybe<Scalars['String']>;
  registerLink?: Maybe<Scalars['String']>;
  coverImageUrl?: Maybe<Scalars['String']>;
  /** Wallclock times */
  startTime?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['String']>;
  /** The IANA region used with wallclock time */
  region?: Maybe<Scalars['String']>;
};

export type Project = {
  __typename?: 'Project';
  /** ID of project in UUID */
  id: Scalars['UUID'];
  /** ID of the user who created the project */
  userId: Scalars['UUID'];
  /** ID of the Meet associated with this project (optional) */
  meetId?: Maybe<Scalars['UUID']>;
  /** Title given to the project */
  title: Scalars['String'];
  /** The URL (i.e. GitHub link) of the project's public source code */
  sourceCodeUrl: Scalars['String'];
  /** The URL of the project's deployment */
  liveUrl: Scalars['String'];
  /** DateTime that the project was submitted */
  createdAt: Scalars['DateTime'];
  /** DateTime that the project was edited */
  updatedAt: Scalars['DateTime'];
  /** The user who created the project */
  user?: Maybe<PublicUser>;
  /** The meet associated with the project */
  meet?: Maybe<Meet>;
  /** A list of MediaAssets for this Project, ordered by index */
  mediaAssets?: Maybe<Array<MediaAsset>>;
};

/** Fields required to create a new project */
export type CreateProjectInput = {
  /** ID of the user who created the project (optional) */
  userId?: Maybe<Scalars['UUID']>;
  /** ID of the Meet associated with this project (optional) */
  meetId?: Maybe<Scalars['UUID']>;
  /** Title given to the project */
  title: Scalars['String'];
  /** The URL (i.e. GitHub link) of the project's public source code */
  sourceCodeUrl: Scalars['String'];
  /** The URL of the project's deployment */
  liveUrl: Scalars['String'];
  /** An array of Cloudinary Public IDs that will be saved as the Project's MediaAssets */
  cloudinaryPublicIds?: Maybe<Array<Scalars['String']>>;
};

/** An event hosted by Mintbean. Only Hack Meets exist for now but will include workshops etc. in the future */
export type MediaAsset = {
  __typename?: 'MediaAsset';
  /** ID of the MediaAsset in UUID */
  id: Scalars['UUID'];
  /** ID of the User who created this MediaAsset */
  userId: Scalars['UUID'];
  /** Public Cloudinary ID used to retrieve the MediaAsset */
  cloudinaryPublicId: Scalars['String'];
  /** An index representing the order information of multiple MediaAssets in a Project submission */
  index: Scalars['Int'];
  /** DateTime that the MediaAsset was saved to the database */
  createdAt: Scalars['DateTime'];
  /** DateTime that the MediaAsset was saved to the database */
  updatedAt: Scalars['DateTime'];
};

export type TestEmailInput = {
  subject: Scalars['String'];
  body: Scalars['String'];
};

export type MeetReminderEmailInput = {
  meetId: Scalars['UUID'];
  subject: Scalars['String'];
  body: Scalars['String'];
};

/** A list of the different border shapes a badge can have */
export enum BadgeShapes {
  Star = 'star',
  Circle = 'circle',
  Square = 'square'
}

/** A badge awarded by Mintbean for excellence within the Mintbean community! */
export type Badge = {
  __typename?: 'Badge';
  /** ID of the badge in UUID */
  badgeId: Scalars['UUID'];
  /** A user friendly :colon-surrounded: badge alias. */
  alias: Scalars['String'];
  /** The shape of the enclosing badge */
  badgeShape: BadgeShapes;
  /** The Font Awesome icon that will be the graphic of the badge (required) */
  faIcon: Scalars['String'];
  /** The hex code for the background color (all 6 digits, no # before code) */
  backgroundHex?: Maybe<Scalars['String']>;
  /** The hex code for the icon color (all 6 digits, no # before code) */
  iconHex?: Maybe<Scalars['String']>;
  /** the official title of the badge */
  title: Scalars['String'];
  /** the official description of the badge */
  description?: Maybe<Scalars['String']>;
  /** the weight of this badge */
  weight?: Maybe<Scalars['Int']>;
  /** when this badge was first created */
  createdAt: Scalars['DateTime'];
  /** when this badge was last updated */
  updatedAt: Scalars['DateTime'];
};

/** the input needed to create a new badge */
export type CreateBadgeInput = {
  /** the id of the badge */
  badgeId: Scalars['String'];
  /** the alias of the badge */
  alias: Scalars['String'];
  /** the shape of the badge */
  badgeShape: BadgeShapes;
  /** The Font Awesome icon that will be the graphic of the badge (required) */
  faIcon: Scalars['String'];
  /** the background color of the badge(optional) */
  backgroundHex?: Maybe<Scalars['String']>;
  /** the color of the icon(optional) */
  iconHex?: Maybe<Scalars['String']>;
  /** the title of the badge */
  title: Scalars['String'];
  /** a description of the badge (optional) */
  description?: Maybe<Scalars['String']>;
  /** how heavily this badge should be weighted(optional) */
  weight?: Maybe<Scalars['Int']>;
};

/** Input that can be used to edit a badge - all fields are optional */
export type EditBadgeInput = {
  /** the alias of the badge */
  alias?: Maybe<Scalars['String']>;
  /** the shape of the badge */
  badgeShape?: Maybe<BadgeShapes>;
  /** The Font Awesome icon that will be the graphic of the badge (required) */
  faIcon?: Maybe<Scalars['String']>;
  /** the background color of the badge(optional) */
  backgroundHex?: Maybe<Scalars['String']>;
  /** the color of the icon(optional) */
  iconHex?: Maybe<Scalars['String']>;
  /** the title of the badge */
  title?: Maybe<Scalars['String']>;
  /** a description of the badge (optional) */
  description?: Maybe<Scalars['String']>;
  /** how heavily this badge should be weighted(optional) */
  weight?: Maybe<Scalars['Int']>;
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
  PrivateUser: ResolverTypeWrapper<PrivateUser>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  PublicUser: ResolverTypeWrapper<PublicUser>;
  Query: ResolverTypeWrapper<{}>;
  UserRegistrationInput: UserRegistrationInput;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  RegisterLinkStatus: RegisterLinkStatus;
  Meet: ResolverTypeWrapper<Meet>;
  CreateMeetInput: CreateMeetInput;
  EditMeetInput: EditMeetInput;
  Project: ResolverTypeWrapper<Project>;
  CreateProjectInput: CreateProjectInput;
  MediaAsset: ResolverTypeWrapper<MediaAsset>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  TestEmailInput: TestEmailInput;
  MeetReminderEmailInput: MeetReminderEmailInput;
  BadgeShapes: BadgeShapes;
  Badge: ResolverTypeWrapper<Badge>;
  CreateBadgeInput: CreateBadgeInput;
  EditBadgeInput: EditBadgeInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  UUID: Scalars['UUID'];
  DateTime: Scalars['DateTime'];
  PrivateUser: PrivateUser;
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  PublicUser: PublicUser;
  Query: {};
  UserRegistrationInput: UserRegistrationInput;
  Mutation: {};
  Post: Post;
  Meet: Meet;
  CreateMeetInput: CreateMeetInput;
  EditMeetInput: EditMeetInput;
  Project: Project;
  CreateProjectInput: CreateProjectInput;
  MediaAsset: MediaAsset;
  Int: Scalars['Int'];
  TestEmailInput: TestEmailInput;
  MeetReminderEmailInput: MeetReminderEmailInput;
  Badge: Badge;
  CreateBadgeInput: CreateBadgeInput;
  EditBadgeInput: EditBadgeInput;
};

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type PrivateUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['PrivateUser'] = ResolversParentTypes['PrivateUser']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>;
  projects?: Resolver<Maybe<Array<ResolversTypes['Project']>>, ParentType, ContextType>;
  registeredMeets?: Resolver<Maybe<Array<ResolversTypes['Meet']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type PublicUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicUser'] = ResolversParentTypes['PublicUser']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>;
  projects?: Resolver<Maybe<Array<ResolversTypes['Project']>>, ParentType, ContextType>;
  registeredMeets?: Resolver<Maybe<Array<ResolversTypes['Meet']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<Maybe<ResolversTypes['PublicUser']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  me?: Resolver<Maybe<ResolversTypes['PrivateUser']>, ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType, RequireFields<QueryPostsArgs, never>>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryPostArgs, 'id'>>;
  meet?: Resolver<Maybe<ResolversTypes['Meet']>, ParentType, ContextType, RequireFields<QueryMeetArgs, 'id'>>;
  meets?: Resolver<Maybe<Array<Maybe<ResolversTypes['Meet']>>>, ParentType, ContextType>;
  projects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Project']>>>, ParentType, ContextType, RequireFields<QueryProjectsArgs, never>>;
  project?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<QueryProjectArgs, 'id'>>;
  badges?: Resolver<Maybe<Array<Maybe<ResolversTypes['Badge']>>>, ParentType, ContextType>;
  badge?: Resolver<Maybe<ResolversTypes['Badge']>, ParentType, ContextType, RequireFields<QueryBadgeArgs, 'badgeId'>>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  login?: Resolver<ResolversTypes['PrivateUser'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  register?: Resolver<ResolversTypes['PrivateUser'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  createMeet?: Resolver<ResolversTypes['Meet'], ParentType, ContextType, RequireFields<MutationCreateMeetArgs, 'input'>>;
  editMeet?: Resolver<ResolversTypes['Meet'], ParentType, ContextType, RequireFields<MutationEditMeetArgs, 'id' | 'input'>>;
  deleteMeet?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteMeetArgs, 'id'>>;
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'input'>>;
  deleteProject?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'id'>>;
  registerForMeet?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRegisterForMeetArgs, 'meetId'>>;
  sendTestEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendTestEmailArgs, 'input'>>;
  sendReminderEmailForMeet?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendReminderEmailForMeetArgs, 'input'>>;
  sendSampleRegistrationEmailForMeet?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendSampleRegistrationEmailForMeetArgs, 'meetId'>>;
  createBadge?: Resolver<ResolversTypes['Badge'], ParentType, ContextType, RequireFields<MutationCreateBadgeArgs, 'input'>>;
  editBadge?: Resolver<ResolversTypes['Badge'], ParentType, ContextType, RequireFields<MutationEditBadgeArgs, 'badgeId' | 'input'>>;
  deleteBadge?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBadgeArgs, 'badgeId'>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['PublicUser']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MeetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Meet'] = ResolversParentTypes['Meet']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  meetType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instructions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  registerLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  registerLinkStatus?: Resolver<Maybe<ResolversTypes['RegisterLinkStatus']>, ParentType, ContextType>;
  coverImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  region?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projects?: Resolver<Maybe<Array<ResolversTypes['Project']>>, ParentType, ContextType>;
  registrants?: Resolver<Maybe<Array<ResolversTypes['PublicUser']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  meetId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sourceCodeUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  liveUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['PublicUser']>, ParentType, ContextType>;
  meet?: Resolver<Maybe<ResolversTypes['Meet']>, ParentType, ContextType>;
  mediaAssets?: Resolver<Maybe<Array<ResolversTypes['MediaAsset']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type MediaAssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['MediaAsset'] = ResolversParentTypes['MediaAsset']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  cloudinaryPublicId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type BadgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Badge'] = ResolversParentTypes['Badge']> = {
  badgeId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  badgeShape?: Resolver<ResolversTypes['BadgeShapes'], ParentType, ContextType>;
  faIcon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  backgroundHex?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  iconHex?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = any> = {
  UUID?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  PrivateUser?: PrivateUserResolvers<ContextType>;
  PublicUser?: PublicUserResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Meet?: MeetResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  MediaAsset?: MediaAssetResolvers<ContextType>;
  Badge?: BadgeResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
