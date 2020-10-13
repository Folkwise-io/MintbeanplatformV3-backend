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
  /** Get a kanban by ID */
  kanban?: Maybe<Kanban>;
  /** Gets all the kanbans */
  kanbans?: Maybe<Array<Maybe<Kanban>>>;
  /** Get a kanban card by ID */
  kanbanCard?: Maybe<KanbanCard>;
  /** Gets all the kanban cards for a given kanban */
  kanbanCards?: Maybe<Array<Maybe<KanbanCard>>>;
  /** Get a kanban session matching given optional inputs. If no userId provided, uses userId from cookies. Only admins can get kanban session of other users */
  kanbanSession?: Maybe<KanbanSession>;
  /** Gets all kanban sessions matching given optional inputs. If no userId provided, uses userId from cookies. Only admins can get kanban sessions of other users. */
  kanbanSessions?: Maybe<Array<Maybe<KanbanSession>>>;
  /** Get a kanban session card by ID */
  kanbanSessionCard?: Maybe<KanbanSessionCard>;
  /** Gets all the kanban session cards for a given kanban session */
  kanbanSessionCards?: Maybe<Array<Maybe<KanbanSessionCard>>>;
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


export type QueryKanbanArgs = {
  id: Scalars['UUID'];
};


export type QueryKanbanCardArgs = {
  id: Scalars['UUID'];
};


export type QueryKanbanCardsArgs = {
  kanbanId: Scalars['UUID'];
};


export type QueryKanbanSessionArgs = {
  id?: Maybe<Scalars['UUID']>;
  kanbanId?: Maybe<Scalars['UUID']>;
  userId?: Maybe<Scalars['UUID']>;
  meetId?: Maybe<Scalars['UUID']>;
};


export type QueryKanbanSessionsArgs = {
  kanbanId?: Maybe<Scalars['UUID']>;
  userId?: Maybe<Scalars['UUID']>;
  meetId?: Maybe<Scalars['UUID']>;
};


export type QueryKanbanSessionCardArgs = {
  id: Scalars['UUID'];
};


export type QueryKanbanSessionCardsArgs = {
  kanbanSessionId: Scalars['UUID'];
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
  /** Creates a new kanban (requires admin privileges) */
  createKanban: Kanban;
  /** Edits a kanban (requires admin privileges) */
  editKanban: Kanban;
  /** Deletes a kanban (requires admin privileges) */
  deleteKanban: Scalars['Boolean'];
  /** Creates a new kanban card (requires admin privileges) */
  createKanbanCard: KanbanCard;
  /** Edits a kanban card (requires admin privileges) */
  editKanbanCard: KanbanCard;
  /** Deletes a kanban card (requires admin privileges) */
  deleteKanbanCard: Scalars['Boolean'];
  /** Creates a new kanban session */
  createKanbanSession: KanbanSession;
  /** Edits a kanban session */
  editKanbanSession: KanbanSession;
  /** Deletes a kanban session */
  deleteKanbanSession: Scalars['Boolean'];
  /** Creates a new kanban session card for the requesting user */
  createKanbanSessionCard: KanbanSessionCard;
  /** Edits a kanban session card (must be kanban session card owner) */
  editKanbanSessionCard: KanbanSessionCard;
  /** Deletes a kanban session card (must be kanban session card owner) */
  deleteKanbanSessionCard: Scalars['Boolean'];
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


export type MutationCreateKanbanArgs = {
  input: CreateKanbanInput;
};


export type MutationEditKanbanArgs = {
  id: Scalars['UUID'];
  input: EditKanbanInput;
};


export type MutationDeleteKanbanArgs = {
  id: Scalars['UUID'];
};


export type MutationCreateKanbanCardArgs = {
  input: CreateKanbanCardInput;
};


export type MutationEditKanbanCardArgs = {
  id: Scalars['UUID'];
  input: EditKanbanCardInput;
};


export type MutationDeleteKanbanCardArgs = {
  id: Scalars['UUID'];
};


export type MutationCreateKanbanSessionArgs = {
  input: CreateKanbanSessionInput;
};


export type MutationEditKanbanSessionArgs = {
  id: Scalars['UUID'];
  input: EditKanbanSessionInput;
};


export type MutationDeleteKanbanSessionArgs = {
  id: Scalars['UUID'];
};


export type MutationCreateKanbanSessionCardArgs = {
  input: CreateKanbanSessionCardInput;
};


export type MutationEditKanbanSessionCardArgs = {
  id: Scalars['UUID'];
  input: EditKanbanSessionCardInput;
};


export type MutationDeleteKanbanSessionCardArgs = {
  id: Scalars['UUID'];
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
  /** The kanban associated with this meet (if provided) */
  kanban?: Maybe<Kanban>;
  kanbanId?: Maybe<Scalars['UUID']>;
  /** The kanban session (if exists) associated with this meet for the requesting user */
  kanbanSession?: Maybe<KanbanSession>;
  kanbanSessionId?: Maybe<Scalars['UUID']>;
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

/** A kanban that serves as a guide for projects. */
export type Kanban = {
  __typename?: 'Kanban';
  /** ID of the Kanban in UUID */
  id: Scalars['UUID'];
  title: Scalars['String'];
  /** A short description about the kanban project */
  description: Scalars['String'];
  /** DateTime that the kanban was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the kanban was modified */
  updatedAt: Scalars['DateTime'];
  /** The kanban cards that belong to a kanban */
  kanbanCards?: Maybe<Array<Maybe<KanbanCard>>>;
};

/** The input needed to create a new kanban */
export type CreateKanbanInput = {
  title: Scalars['String'];
  /** A short description about the kanban project */
  description: Scalars['String'];
};

/** Input that can be used to edit a kanban - all fields are optional */
export type EditKanbanInput = {
  title?: Maybe<Scalars['String']>;
  /** A short description about the kanban project */
  description?: Maybe<Scalars['String']>;
};

/** A kanban card that belongs to a kanban. */
export type KanbanCard = {
  __typename?: 'KanbanCard';
  /** ID of the kanban card in UUID */
  id: Scalars['UUID'];
  title: Scalars['String'];
  /** A markdown body of the kanban card content */
  body: Scalars['String'];
  /** The master index of this card in the kanban. Determines the order cards are presented to user on initial use */
  index: Scalars['Int'];
  /** A reference to the kanban this kanban card belongs to */
  kanbanId: Scalars['UUID'];
  /** DateTime that the kanban was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the kanban was modified */
  updatedAt: Scalars['DateTime'];
};

/** The input needed to create a new kanban card */
export type CreateKanbanCardInput = {
  /** A reference to the kanban this kanban card belongs to */
  kanbanId: Scalars['UUID'];
  title: Scalars['String'];
  /** The master index of this card in the kanban. Determines the order cards are presented to user on initial use */
  index: Scalars['Int'];
  /** A markdown body of the kanban card content */
  body: Scalars['String'];
};

/** Input that can be used to edit a kanban card - all fields are optional */
export type EditKanbanCardInput = {
  /** A reference to the kanban this kanban card belongs to */
  kanbanId?: Maybe<Scalars['UUID']>;
  title?: Maybe<Scalars['String']>;
  /** The master index of this card in the kanban. Determines the order cards are presented to user on initial use */
  index?: Maybe<Scalars['Int']>;
  /** A markdown body of the kanban card content */
  body?: Maybe<Scalars['String']>;
};

/** A session that stores a view of given kanban with individualized card placement */
export type KanbanSession = {
  __typename?: 'KanbanSession';
  /** ID of the kanban session in UUID */
  id: Scalars['UUID'];
  /** Id of master kanban this session is based off of */
  kanbanId: Scalars['UUID'];
  /** Id of user who has access to this kanban session */
  userId: Scalars['UUID'];
  /** (Optional) id of meet this kanban session is associated with */
  meetId?: Maybe<Scalars['UUID']>;
  /** DateTime that the kanban session was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the kanban session was modified */
  updatedAt: Scalars['DateTime'];
  /** The kanban sessions cards that belong to a kanban session */
  kanbanSessionCards?: Maybe<Array<Maybe<KanbanSessionCard>>>;
};

export type KanbanSessionSearchArgs = {
  __typename?: 'KanbanSessionSearchArgs';
  meetId?: Maybe<Scalars['UUID']>;
  kanbanId?: Maybe<Scalars['UUID']>;
  userId?: Maybe<Scalars['UUID']>;
};

/** The input needed to create a new kanban */
export type CreateKanbanSessionInput = {
  kanbanId: Scalars['UUID'];
  userId: Scalars['UUID'];
  meetId?: Maybe<Scalars['UUID']>;
};

/** Input that can be used to edit a kanban session - all fields are optional */
export type EditKanbanSessionInput = {
  kanbanId?: Maybe<Scalars['UUID']>;
  userId?: Maybe<Scalars['UUID']>;
  meetId?: Maybe<Scalars['UUID']>;
};

/** Possible statuses of a kanban session card */
export enum KanbanSessionCardStatusEnum {
  Todo = 'TODO',
  Wip = 'WIP',
  Done = 'DONE'
}

/** A kanban session card that belongs to a kanban session. */
export type KanbanSessionCard = {
  __typename?: 'KanbanSessionCard';
  /** ID of the kanban card in UUID */
  id: Scalars['UUID'];
  /** A reference to the kanban session this kanban session card belongs to */
  kanbanSessionId: Scalars['UUID'];
  /** A reference to the kanban card this kanban session card points to */
  kanbanCardId: Scalars['UUID'];
  /** Determines the numerical order cards are presented to user in the fiven status column */
  index: Scalars['Int'];
  /** Status of the card, representing which kanban column it resides in ('TODO', 'WIP' or 'DONE') */
  status: KanbanSessionCardStatusEnum;
  /** DateTime that the kanban session was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the kanban session was modified */
  updatedAt: Scalars['DateTime'];
};

/** The input needed to create a new kanban session card */
export type CreateKanbanSessionCardInput = {
  /** A reference to the kanban session this kanban card belongs to */
  kanbanSessionId: Scalars['UUID'];
  /** A reference to the kanban card this kanban session card points to */
  kanbanCardId: Scalars['UUID'];
  /** Determines the numerical order cards are presented to user in the fiven status column */
  index: Scalars['Int'];
  /** Status of the card, representing which kanban column it resides in ('TODO', 'WIP' or 'DONE') */
  status: KanbanSessionCardStatusEnum;
};

/** Input that can be used to edit a kanban session card - all fields are optional */
export type EditKanbanSessionCardInput = {
  /** A reference to the kanban session this kanban card belongs to */
  kanbanSessionId?: Maybe<Scalars['UUID']>;
  /** A reference to the kanban card this kanban session card points to */
  kanbanCardId?: Maybe<Scalars['UUID']>;
  /** Determines the numerical order cards are presented to user in the fiven status column */
  index?: Maybe<Scalars['Int']>;
  /** Status of the card, representing which kanban column it resides in ('TODO', 'WIP' or 'DONE') */
  status?: Maybe<KanbanSessionCardStatusEnum>;
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
  Meet: ResolverTypeWrapper<Meet>;
  CreateMeetInput: CreateMeetInput;
  EditMeetInput: EditMeetInput;
  Project: ResolverTypeWrapper<Project>;
  CreateProjectInput: CreateProjectInput;
  MediaAsset: ResolverTypeWrapper<MediaAsset>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Kanban: ResolverTypeWrapper<Kanban>;
  CreateKanbanInput: CreateKanbanInput;
  EditKanbanInput: EditKanbanInput;
  KanbanCard: ResolverTypeWrapper<KanbanCard>;
  CreateKanbanCardInput: CreateKanbanCardInput;
  EditKanbanCardInput: EditKanbanCardInput;
  KanbanSession: ResolverTypeWrapper<KanbanSession>;
  KanbanSessionSearchArgs: ResolverTypeWrapper<KanbanSessionSearchArgs>;
  CreateKanbanSessionInput: CreateKanbanSessionInput;
  EditKanbanSessionInput: EditKanbanSessionInput;
  KanbanSessionCardStatusEnum: KanbanSessionCardStatusEnum;
  KanbanSessionCard: ResolverTypeWrapper<KanbanSessionCard>;
  CreateKanbanSessionCardInput: CreateKanbanSessionCardInput;
  EditKanbanSessionCardInput: EditKanbanSessionCardInput;
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
  Kanban: Kanban;
  CreateKanbanInput: CreateKanbanInput;
  EditKanbanInput: EditKanbanInput;
  KanbanCard: KanbanCard;
  CreateKanbanCardInput: CreateKanbanCardInput;
  EditKanbanCardInput: EditKanbanCardInput;
  KanbanSession: KanbanSession;
  KanbanSessionSearchArgs: KanbanSessionSearchArgs;
  CreateKanbanSessionInput: CreateKanbanSessionInput;
  EditKanbanSessionInput: EditKanbanSessionInput;
  KanbanSessionCard: KanbanSessionCard;
  CreateKanbanSessionCardInput: CreateKanbanSessionCardInput;
  EditKanbanSessionCardInput: EditKanbanSessionCardInput;
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
  kanban?: Resolver<Maybe<ResolversTypes['Kanban']>, ParentType, ContextType, RequireFields<QueryKanbanArgs, 'id'>>;
  kanbans?: Resolver<Maybe<Array<Maybe<ResolversTypes['Kanban']>>>, ParentType, ContextType>;
  kanbanCard?: Resolver<Maybe<ResolversTypes['KanbanCard']>, ParentType, ContextType, RequireFields<QueryKanbanCardArgs, 'id'>>;
  kanbanCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCard']>>>, ParentType, ContextType, RequireFields<QueryKanbanCardsArgs, 'kanbanId'>>;
  kanbanSession?: Resolver<Maybe<ResolversTypes['KanbanSession']>, ParentType, ContextType, RequireFields<QueryKanbanSessionArgs, never>>;
  kanbanSessions?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanSession']>>>, ParentType, ContextType, RequireFields<QueryKanbanSessionsArgs, never>>;
  kanbanSessionCard?: Resolver<Maybe<ResolversTypes['KanbanSessionCard']>, ParentType, ContextType, RequireFields<QueryKanbanSessionCardArgs, 'id'>>;
  kanbanSessionCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanSessionCard']>>>, ParentType, ContextType, RequireFields<QueryKanbanSessionCardsArgs, 'kanbanSessionId'>>;
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
  createKanban?: Resolver<ResolversTypes['Kanban'], ParentType, ContextType, RequireFields<MutationCreateKanbanArgs, 'input'>>;
  editKanban?: Resolver<ResolversTypes['Kanban'], ParentType, ContextType, RequireFields<MutationEditKanbanArgs, 'id' | 'input'>>;
  deleteKanban?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteKanbanArgs, 'id'>>;
  createKanbanCard?: Resolver<ResolversTypes['KanbanCard'], ParentType, ContextType, RequireFields<MutationCreateKanbanCardArgs, 'input'>>;
  editKanbanCard?: Resolver<ResolversTypes['KanbanCard'], ParentType, ContextType, RequireFields<MutationEditKanbanCardArgs, 'id' | 'input'>>;
  deleteKanbanCard?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteKanbanCardArgs, 'id'>>;
  createKanbanSession?: Resolver<ResolversTypes['KanbanSession'], ParentType, ContextType, RequireFields<MutationCreateKanbanSessionArgs, 'input'>>;
  editKanbanSession?: Resolver<ResolversTypes['KanbanSession'], ParentType, ContextType, RequireFields<MutationEditKanbanSessionArgs, 'id' | 'input'>>;
  deleteKanbanSession?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteKanbanSessionArgs, 'id'>>;
  createKanbanSessionCard?: Resolver<ResolversTypes['KanbanSessionCard'], ParentType, ContextType, RequireFields<MutationCreateKanbanSessionCardArgs, 'input'>>;
  editKanbanSessionCard?: Resolver<ResolversTypes['KanbanSessionCard'], ParentType, ContextType, RequireFields<MutationEditKanbanSessionCardArgs, 'id' | 'input'>>;
  deleteKanbanSessionCard?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteKanbanSessionCardArgs, 'id'>>;
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
  coverImageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  region?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projects?: Resolver<Maybe<Array<ResolversTypes['Project']>>, ParentType, ContextType>;
  registrants?: Resolver<Maybe<Array<ResolversTypes['PublicUser']>>, ParentType, ContextType>;
  kanban?: Resolver<Maybe<ResolversTypes['Kanban']>, ParentType, ContextType>;
  kanbanId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  kanbanSession?: Resolver<Maybe<ResolversTypes['KanbanSession']>, ParentType, ContextType>;
  kanbanSessionId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
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

export type KanbanResolvers<ContextType = any, ParentType extends ResolversParentTypes['Kanban'] = ResolversParentTypes['Kanban']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  kanbanCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCard']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanCardResolvers<ContextType = any, ParentType extends ResolversParentTypes['KanbanCard'] = ResolversParentTypes['KanbanCard']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  kanbanId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanSessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['KanbanSession'] = ResolversParentTypes['KanbanSession']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  kanbanId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  meetId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  kanbanSessionCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanSessionCard']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanSessionSearchArgsResolvers<ContextType = any, ParentType extends ResolversParentTypes['KanbanSessionSearchArgs'] = ResolversParentTypes['KanbanSessionSearchArgs']> = {
  meetId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  kanbanId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanSessionCardResolvers<ContextType = any, ParentType extends ResolversParentTypes['KanbanSessionCard'] = ResolversParentTypes['KanbanSessionCard']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  kanbanSessionId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  kanbanCardId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  index?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['KanbanSessionCardStatusEnum'], ParentType, ContextType>;
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
  Kanban?: KanbanResolvers<ContextType>;
  KanbanCard?: KanbanCardResolvers<ContextType>;
  KanbanSession?: KanbanSessionResolvers<ContextType>;
  KanbanSessionSearchArgs?: KanbanSessionSearchArgsResolvers<ContextType>;
  KanbanSessionCard?: KanbanSessionCardResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
