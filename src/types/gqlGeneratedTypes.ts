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
  /** Get a kanbanCanon by ID */
  kanbanCanon?: Maybe<KanbanCanon>;
  /** Gets all the kanbanCanons */
  kanbanCanons?: Maybe<Array<Maybe<KanbanCanon>>>;
  /** Get a kanban card by ID */
  kanbanCanonCard?: Maybe<KanbanCanonCard>;
  /** Gets all the kanban cards for a given kanban */
  kanbanCanonCards?: Maybe<Array<Maybe<KanbanCanonCard>>>;
  /** Get a kanban matching given optional inputs. Only admins can get kanban of other users */
  kanban?: Maybe<Kanban>;
  /** Gets all kanbans matching given optional inputs. Only admins can get kanbans of other users. */
  kanbans?: Maybe<Array<Maybe<Kanban>>>;
  /** Gets all the kanban cards for a given kanban */
  kanbanCards?: Maybe<Array<Maybe<KanbanCard>>>;
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


export type QueryKanbanCanonArgs = {
  id: Scalars['UUID'];
};


export type QueryKanbanCanonCardArgs = {
  id: Scalars['UUID'];
};


export type QueryKanbanCanonCardsArgs = {
  kanbanCanonId: Scalars['UUID'];
};


export type QueryKanbanArgs = {
  id?: Maybe<Scalars['UUID']>;
  kanbanCanonId?: Maybe<Scalars['UUID']>;
  userId?: Maybe<Scalars['UUID']>;
  meetId?: Maybe<Scalars['UUID']>;
};


export type QueryKanbansArgs = {
  kanbanCanonId?: Maybe<Scalars['UUID']>;
  userId?: Maybe<Scalars['UUID']>;
  meetId?: Maybe<Scalars['UUID']>;
};


export type QueryKanbanCardsArgs = {
  kanbanId: Scalars['UUID'];
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
  /** Creates a new kanbanCanon (requires admin privileges) */
  createKanbanCanon: KanbanCanon;
  /** Edits an existing kanbanCanon (requires admin privileges) */
  editKanbanCanon: KanbanCanon;
  /** Deletes a kanbanCanon (requires admin privileges) */
  deleteKanbanCanon: Scalars['Boolean'];
  /** Creates a new kanbanCanonCard (requires admin privileges) */
  createKanbanCanonCard: KanbanCanonCard;
  /** Edits a kanban card (requires admin privileges) */
  editKanbanCanonCard: KanbanCanonCard;
  /** Deletes a kanban card (requires admin privileges) */
  deleteKanbanCanonCard: Scalars['Boolean'];
  /** Creates a new kanban view */
  createKanban: Kanban;
  deleteKanban: Scalars['Boolean'];
  /** Updates a kanbanCard */
  updateKanbanCard?: Maybe<KanbanCard>;
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


export type MutationCreateKanbanCanonArgs = {
  input: CreateKanbanCanonInput;
};


export type MutationEditKanbanCanonArgs = {
  id: Scalars['UUID'];
  input: EditKanbanCanonInput;
};


export type MutationDeleteKanbanCanonArgs = {
  id: Scalars['UUID'];
};


export type MutationCreateKanbanCanonCardArgs = {
  input: CreateKanbanCanonCardInput;
};


export type MutationEditKanbanCanonCardArgs = {
  id: Scalars['UUID'];
  input: EditKanbanCanonCardInput;
};


export type MutationDeleteKanbanCanonCardArgs = {
  id: Scalars['UUID'];
};


export type MutationCreateKanbanArgs = {
  input: CreateKanbanInput;
};


export type MutationDeleteKanbanArgs = {
  id: Scalars['UUID'];
};


export type MutationUpdateKanbanCardArgs = {
  input: UpdateKanbanCardInput;
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
  /** The kanbanCanon associated with this meet (if provided) */
  kanbanCanon?: Maybe<KanbanCanon>;
  kanbanCanonId?: Maybe<Scalars['UUID']>;
  /** The personalized kanban view (if exists) associated with this meet for the requesting user */
  kanban?: Maybe<Kanban>;
  kanbanId?: Maybe<Scalars['UUID']>;
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

/** The master definition of a kanban that serves as a guide for projects. */
export type KanbanCanon = {
  __typename?: 'KanbanCanon';
  /** ID of the KanbanCanon in UUID */
  id: Scalars['UUID'];
  title: Scalars['String'];
  /** A short cannonical description about the kanban project */
  description: Scalars['String'];
  /** DateTime that the kanbanCanon was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the kanbanCanon was modified */
  updatedAt: Scalars['DateTime'];
  /** The kanban cards that belong to a kanban */
  kanbanCanonCards?: Maybe<Array<Maybe<KanbanCanonCard>>>;
};

/** The input needed to create a new kanbanCanon */
export type CreateKanbanCanonInput = {
  title: Scalars['String'];
  /** A short cannonical description about the kanban project */
  description: Scalars['String'];
};

/** Input that can be used to edit a kanban - all fields are optional */
export type EditKanbanCanonInput = {
  title?: Maybe<Scalars['String']>;
  /** A short description about the kanban project */
  description?: Maybe<Scalars['String']>;
};

/** Possible initial statuses of a kanban card. Defaults to TODO, unless specified otherwise */
export enum KanbanCanonCardStatusEnum {
  Todo = 'TODO',
  Wip = 'WIP',
  Done = 'DONE'
}

/** A canonical kanban card that belongs to a kanban. */
export type KanbanCanonCard = {
  __typename?: 'KanbanCanonCard';
  /** ID of the kanban card in UUID */
  id: Scalars['UUID'];
  title: Scalars['String'];
  /** A markdown body of the kanban card content */
  body: Scalars['String'];
  /** The initial status column this kanbanCanonCard should appear in */
  status: KanbanCanonCardStatusEnum;
  /** A reference to the kanban this kanban card belongs to */
  kanbanCanonId: Scalars['UUID'];
  /** DateTime that the kanban was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the kanban was modified */
  updatedAt: Scalars['DateTime'];
};

export type CreateKanbanCanonCardInput = {
  /** A reference to the kanbanCanon this kanbanCanonCard belongs to */
  kanbanCanonId: Scalars['UUID'];
  title: Scalars['String'];
  /** (Optional) The column this card will initailly appear in. Defaults to TODO */
  status?: Maybe<KanbanCanonCardStatusEnum>;
  /** A markdown body of the kanbanCanonCard content */
  body: Scalars['String'];
};

export type EditKanbanCanonCardInput = {
  title?: Maybe<Scalars['String']>;
  /** (Optional) The column this card will initailly appear in. Defaults to TODO */
  status?: Maybe<KanbanCanonCardStatusEnum>;
  /** A markdown body of the kanbanCanonCard content */
  body?: Maybe<Scalars['String']>;
};

/** A personalized view of a kanbanCanon that holds the positions of kanban cards for the session owner */
export type Kanban = {
  __typename?: 'Kanban';
  /** ID of the kanban in UUID */
  id: Scalars['UUID'];
  title: Scalars['String'];
  description: Scalars['String'];
  /** Id of the master kanban off which this view is based */
  kanbanCanonId: Scalars['UUID'];
  /** Id of user who owns the view of this kanban */
  userId: Scalars['UUID'];
  /** Id of meet this kanban is associated with. Possibly null */
  meetId?: Maybe<Scalars['UUID']>;
  /** DateTime that the kanban was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the kanban was modified */
  updatedAt: Scalars['DateTime'];
  /** The kanban cards that belong to a kanban */
  kanbanCards?: Maybe<Array<Maybe<KanbanCard>>>;
};

/** The input needed to create a new kanban */
export type CreateKanbanInput = {
  /** Id of the kanbanCanon off which this kanban is based */
  kanbanCanonId: Scalars['UUID'];
  /** Id of the user that owns this kanban view */
  userId: Scalars['UUID'];
  /** (Optional) Id of the meet this kanban belongs to */
  meetId?: Maybe<Scalars['UUID']>;
};

/** A kanban card on a kanban. Holds personalized positioning data. */
export type KanbanCard = {
  __typename?: 'KanbanCard';
  /** ID of the kanban card in UUID */
  id: Scalars['UUID'];
  title: Scalars['String'];
  /** A markdown body of the kanban card content */
  body: Scalars['String'];
  /** The initial status column this kanbanCanonCard should appear in */
  status: KanbanCanonCardStatusEnum;
  /** A reference to the kanban this kanban card belongs to */
  kanbanId: Scalars['UUID'];
  /** DateTime that the kanban card was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the kanban card was modified */
  updatedAt: Scalars['DateTime'];
};

export type UpdateKanbanCardInput = {
  /** Id of the kaban card (note: this id is identical to the id of it's base kanban canon card) */
  id: Scalars['UUID'];
  kanbanId: Scalars['UUID'];
  /** The column this card belongs in: TODO, WIP or DONE */
  status: KanbanCanonCardStatusEnum;
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
  KanbanCanon: ResolverTypeWrapper<KanbanCanon>;
  CreateKanbanCanonInput: CreateKanbanCanonInput;
  EditKanbanCanonInput: EditKanbanCanonInput;
  KanbanCanonCardStatusEnum: KanbanCanonCardStatusEnum;
  KanbanCanonCard: ResolverTypeWrapper<KanbanCanonCard>;
  CreateKanbanCanonCardInput: CreateKanbanCanonCardInput;
  EditKanbanCanonCardInput: EditKanbanCanonCardInput;
  Kanban: ResolverTypeWrapper<Kanban>;
  CreateKanbanInput: CreateKanbanInput;
  KanbanCard: ResolverTypeWrapper<KanbanCard>;
  UpdateKanbanCardInput: UpdateKanbanCardInput;
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
  KanbanCanon: KanbanCanon;
  CreateKanbanCanonInput: CreateKanbanCanonInput;
  EditKanbanCanonInput: EditKanbanCanonInput;
  KanbanCanonCard: KanbanCanonCard;
  CreateKanbanCanonCardInput: CreateKanbanCanonCardInput;
  EditKanbanCanonCardInput: EditKanbanCanonCardInput;
  Kanban: Kanban;
  CreateKanbanInput: CreateKanbanInput;
  KanbanCard: KanbanCard;
  UpdateKanbanCardInput: UpdateKanbanCardInput;
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
  kanbanCanon?: Resolver<Maybe<ResolversTypes['KanbanCanon']>, ParentType, ContextType, RequireFields<QueryKanbanCanonArgs, 'id'>>;
  kanbanCanons?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCanon']>>>, ParentType, ContextType>;
  kanbanCanonCard?: Resolver<Maybe<ResolversTypes['KanbanCanonCard']>, ParentType, ContextType, RequireFields<QueryKanbanCanonCardArgs, 'id'>>;
  kanbanCanonCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCanonCard']>>>, ParentType, ContextType, RequireFields<QueryKanbanCanonCardsArgs, 'kanbanCanonId'>>;
  kanban?: Resolver<Maybe<ResolversTypes['Kanban']>, ParentType, ContextType, RequireFields<QueryKanbanArgs, never>>;
  kanbans?: Resolver<Maybe<Array<Maybe<ResolversTypes['Kanban']>>>, ParentType, ContextType, RequireFields<QueryKanbansArgs, never>>;
  kanbanCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCard']>>>, ParentType, ContextType, RequireFields<QueryKanbanCardsArgs, 'kanbanId'>>;
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
  createKanbanCanon?: Resolver<ResolversTypes['KanbanCanon'], ParentType, ContextType, RequireFields<MutationCreateKanbanCanonArgs, 'input'>>;
  editKanbanCanon?: Resolver<ResolversTypes['KanbanCanon'], ParentType, ContextType, RequireFields<MutationEditKanbanCanonArgs, 'id' | 'input'>>;
  deleteKanbanCanon?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteKanbanCanonArgs, 'id'>>;
  createKanbanCanonCard?: Resolver<ResolversTypes['KanbanCanonCard'], ParentType, ContextType, RequireFields<MutationCreateKanbanCanonCardArgs, 'input'>>;
  editKanbanCanonCard?: Resolver<ResolversTypes['KanbanCanonCard'], ParentType, ContextType, RequireFields<MutationEditKanbanCanonCardArgs, 'id' | 'input'>>;
  deleteKanbanCanonCard?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteKanbanCanonCardArgs, 'id'>>;
  createKanban?: Resolver<ResolversTypes['Kanban'], ParentType, ContextType, RequireFields<MutationCreateKanbanArgs, 'input'>>;
  deleteKanban?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteKanbanArgs, 'id'>>;
  updateKanbanCard?: Resolver<Maybe<ResolversTypes['KanbanCard']>, ParentType, ContextType, RequireFields<MutationUpdateKanbanCardArgs, 'input'>>;
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
  kanbanCanon?: Resolver<Maybe<ResolversTypes['KanbanCanon']>, ParentType, ContextType>;
  kanbanCanonId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  kanban?: Resolver<Maybe<ResolversTypes['Kanban']>, ParentType, ContextType>;
  kanbanId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
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

export type KanbanCanonResolvers<ContextType = any, ParentType extends ResolversParentTypes['KanbanCanon'] = ResolversParentTypes['KanbanCanon']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  kanbanCanonCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCanonCard']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanCanonCardResolvers<ContextType = any, ParentType extends ResolversParentTypes['KanbanCanonCard'] = ResolversParentTypes['KanbanCanonCard']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['KanbanCanonCardStatusEnum'], ParentType, ContextType>;
  kanbanCanonId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanResolvers<ContextType = any, ParentType extends ResolversParentTypes['Kanban'] = ResolversParentTypes['Kanban']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  kanbanCanonId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  meetId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  kanbanCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCard']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanCardResolvers<ContextType = any, ParentType extends ResolversParentTypes['KanbanCard'] = ResolversParentTypes['KanbanCard']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['KanbanCanonCardStatusEnum'], ParentType, ContextType>;
  kanbanId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
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
  KanbanCanon?: KanbanCanonResolvers<ContextType>;
  KanbanCanonCard?: KanbanCanonCardResolvers<ContextType>;
  Kanban?: KanbanResolvers<ContextType>;
  KanbanCard?: KanbanCardResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
