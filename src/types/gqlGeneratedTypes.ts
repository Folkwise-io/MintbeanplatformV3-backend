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
  /** Gets one badge by id or alias */
  badge?: Maybe<Badge>;
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
  /** Creates a new meet  */
  createMeet: Meet;
  /** Edits a meet (requires admin privileges) */
  editMeet: Meet;
  /** Deletes a meet (requires admin privileges) */
  deleteMeet: Scalars['Boolean'];
  /** Creates a new project (must be logged in) */
  createProject: Project;
  /** Deletes a project by ID (user must be logged in and own the project) */
  deleteProject: Scalars['Boolean'];
  /** Adds badges to a project by ids (WARNING: overwrites existing badges for project) (admin only) */
  awardBadgesToProject?: Maybe<Project>;
  /** Registers the current logged-in user for a meet. */
  registerForMeet: Scalars['Boolean'];
  /** Creates a new badge (requires admin privileges */
  createBadge: Badge;
  /** Edits a badge (requires admin privileges) */
  editBadge: Badge;
  /** Deletes a badge (requires admin privileges) */
  deleteBadge: Scalars['Boolean'];
  /** Creates a new kanbanCanon (requires admin privileges) */
  createKanbanCanon: KanbanCanon;
  /** Edits an existing kanbanCanon (requires admin privileges) */
  editKanbanCanon: KanbanCanon;
  /** Update the position of an existing kanbanCanonCard on a kanbanCanon. Returns updated card positions object. */
  updateKanbanCanonCardPositions: KanbanCardPositions;
  /** Creates a new kanbanCanonCard (requires admin privileges) */
  createKanbanCanonCard: KanbanCanonCard;
  /** Edits a kanban card (requires admin privileges) */
  editKanbanCanonCard: KanbanCanonCard;
  /** Deletes a kanban card (requires admin privileges) */
  deleteKanbanCanonCard: Scalars['Boolean'];
  /** Creates a new kanban view */
  createKanban: Kanban;
  /** Update the position of a card on a kanban, and get updated card positions object */
  updateKanbanCardPositions: KanbanCardPositions;
  deleteKanban: Scalars['Boolean'];
  /** For sending light client emails, like contact form emails. By-passes scheduledEmail queue. */
  sendContactFormEmail: EmailResponse;
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


export type MutationAwardBadgesToProjectArgs = {
  projectId: Scalars['UUID'];
  badgeIds: Array<Maybe<Scalars['UUID']>>;
};


export type MutationRegisterForMeetArgs = {
  meetId: Scalars['UUID'];
};


export type MutationCreateBadgeArgs = {
  input: CreateBadgeInput;
};


export type MutationEditBadgeArgs = {
  id: Scalars['UUID'];
  input: EditBadgeInput;
};


export type MutationDeleteBadgeArgs = {
  id: Scalars['UUID'];
};


export type MutationCreateKanbanCanonArgs = {
  input: CreateKanbanCanonInput;
};


export type MutationEditKanbanCanonArgs = {
  id: Scalars['UUID'];
  input: EditKanbanCanonInput;
};


export type MutationUpdateKanbanCanonCardPositionsArgs = {
  id: Scalars['UUID'];
  input: UpdateCardPositionInput;
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


export type MutationUpdateKanbanCardPositionsArgs = {
  id: Scalars['UUID'];
  input: UpdateCardPositionInput;
};


export type MutationDeleteKanbanArgs = {
  id: Scalars['UUID'];
};


export type MutationSendContactFormEmailArgs = {
  input: SendContactFormEmailInput;
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

/** The different meet types that are currently available */
export enum MeetType {
  Hackathon = 'HACKATHON',
  Workshop = 'WORKSHOP',
  Webinar = 'WEBINAR',
  Lecture = 'LECTURE'
}

/** An event hosted by Mintbean. Only Hack Meets exist for now but will include workshops etc. in the future */
export type Meet = {
  __typename?: 'Meet';
  /** ID of the Meet in UUID */
  id: Scalars['UUID'];
  /** The type of the Meet as enum string. */
  meetType: MeetType;
  title: Scalars['String'];
  /** A short blurb about the Meet */
  description: Scalars['String'];
  /** A detailed description of the Meet */
  detailedDescription?: Maybe<Scalars['String']>;
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
};

/** The input needed to create a new meet */
export type CreateMeetInput = {
  /** The type of the Meet as enum string.  */
  meetType: MeetType;
  title: Scalars['String'];
  /** A short blurb about the Meet */
  description: Scalars['String'];
  /** A detailed description of the Meet in markdown format */
  detailedDescription?: Maybe<Scalars['String']>;
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
  /** The type of the Meet as enum string. */
  meetType?: Maybe<MeetType>;
  title?: Maybe<Scalars['String']>;
  /** A short blurb about the Meet */
  description?: Maybe<Scalars['String']>;
  /** A detailed description of the Meet in markdown format */
  detailedDescription?: Maybe<Scalars['String']>;
  /** The instructions in markdown format */
  instructions?: Maybe<Scalars['String']>;
  registerLink?: Maybe<Scalars['String']>;
  coverImageUrl?: Maybe<Scalars['String']>;
  /** Wallclock times */
  startTime?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['String']>;
  /** The IANA region used with wallclock time */
  region?: Maybe<Scalars['String']>;
  /** The kanbanCanon associated with this meet (if provided) */
  kanbanCanonId?: Maybe<Scalars['UUID']>;
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
  /** The badges associated with the project */
  badges?: Maybe<Array<Maybe<Badge>>>;
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

export enum BadgeShape {
  Star = 'STAR',
  Circle = 'CIRCLE',
  Square = 'SQUARE'
}

/** A badge awarded by Mintbean for excellence within the Mintbean community! */
export type Badge = {
  __typename?: 'Badge';
  /** ID of the badge in UUID */
  id: Scalars['UUID'];
  /** A user friendly :colon-surrounded: badge alias. */
  alias: Scalars['String'];
  /** The shape of the enclosing badge from an enumerable list */
  badgeShape: BadgeShape;
  /** The Font Awesome icon that will be the graphic of the badge (required) */
  faIcon: Scalars['String'];
  /** The hex code for the background color (all 6 digits, no # before code) defaults to 000000 (black) */
  backgroundHex?: Maybe<Scalars['String']>;
  /** The hex code for the icon color (all 6 digits, no # before code). defaults to ffffff (white) */
  iconHex?: Maybe<Scalars['String']>;
  /** The official title of the badge */
  title: Scalars['String'];
  /** The official description of the badge */
  description?: Maybe<Scalars['String']>;
  /** The weight of this badge */
  weight?: Maybe<Scalars['Int']>;
  /** When this badge was first created */
  createdAt: Scalars['DateTime'];
  /** When this badge was last updated */
  updatedAt: Scalars['DateTime'];
  /** A list of projects awarded this badge */
  projects?: Maybe<Array<Maybe<Project>>>;
};

/** The input needed to create a new badge */
export type CreateBadgeInput = {
  /** The alias of the badge */
  alias: Scalars['String'];
  /** The shape of the badge from an enumerable list */
  badgeShape: BadgeShape;
  /** The Font Awesome icon that will be the graphic of the badge (required) */
  faIcon: Scalars['String'];
  /** The hex code for the background color (all 6 digits, no # before code) defaults to 000000 (black) */
  backgroundHex?: Maybe<Scalars['String']>;
  /** The hex code for the icon color (all 6 digits, no # before code). defaults to ffffff (white) */
  iconHex?: Maybe<Scalars['String']>;
  /** The title of the badge */
  title: Scalars['String'];
  /** A description of the badge (optional) */
  description?: Maybe<Scalars['String']>;
  /** How heavily this badge should be weighted(optional) */
  weight?: Maybe<Scalars['Int']>;
};

/** Input that can be used to edit a badge - all fields are optional */
export type EditBadgeInput = {
  /** The alias of the badge */
  alias?: Maybe<Scalars['String']>;
  /** The shape of the badge from an enumerable list */
  badgeShape?: Maybe<BadgeShape>;
  /** The Font Awesome icon that will be the graphic of the badge (required) */
  faIcon?: Maybe<Scalars['String']>;
  /** The hex code for the background color (all 6 digits, no # before code) defaults to 000000 (black) */
  backgroundHex?: Maybe<Scalars['String']>;
  /** The hex code for the icon color (all 6 digits, no # before code). defaults to ffffff (white) */
  iconHex?: Maybe<Scalars['String']>;
  /** The title of the badge */
  title?: Maybe<Scalars['String']>;
  /** A description of the badge (optional) */
  description?: Maybe<Scalars['String']>;
  /** How heavily this badge should be weighted(optional) */
  weight?: Maybe<Scalars['Int']>;
};

/** The master definition of a kanban that serves as a guide for projects. */
export type KanbanCanon = {
  __typename?: 'KanbanCanon';
  /** ID of the KanbanCanon in UUID */
  id: Scalars['UUID'];
  title: Scalars['String'];
  /** A short cannonical description about the kanban project */
  description: Scalars['String'];
  /** An object storing the status column and indexes of kanban canon cards */
  cardPositions: KanbanCardPositions;
  /** DateTime that the kanbanCanon was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the kanbanCanon was modified */
  updatedAt: Scalars['DateTime'];
  /** The kanban cards that belong to a kanban canon */
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

export type UpdateCardPositionInput = {
  cardId: Scalars['UUID'];
  status: KanbanCanonCardStatusEnum;
  index: Scalars['Int'];
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
  /** (Optional) The index this card will initially appear at. Defaults to end of status array */
  index?: Maybe<Scalars['Int']>;
  /** A markdown body of the kanbanCanonCard content */
  body: Scalars['String'];
};

export type EditKanbanCanonCardInput = {
  title?: Maybe<Scalars['String']>;
  /** (Optional) The column this card will initailly appear at. Defaults to TODO */
  status?: Maybe<KanbanCanonCardStatusEnum>;
  /** (Optional) The index this card will initially appear at. Defaults to end of status array */
  index?: Maybe<Scalars['Int']>;
  /** A markdown body of the kanbanCanonCard content */
  body?: Maybe<Scalars['String']>;
};

export type KanbanCardPositions = {
  __typename?: 'KanbanCardPositions';
  todo: Array<Scalars['UUID']>;
  wip: Array<Scalars['UUID']>;
  done: Array<Scalars['UUID']>;
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
  /** An object storing the status column and indexes of kanban cards */
  cardPositions: KanbanCardPositions;
  /** DateTime that the kanban was created */
  createdAt: Scalars['DateTime'];
  /** DateTime that the kanban was modified */
  updatedAt: Scalars['DateTime'];
  /** The kanban cards that belong to a kanban */
  kanbanCards?: Maybe<Array<Maybe<KanbanCanonCard>>>;
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

export enum EmailResponseStatus {
  Success = 'SUCCESS',
  BadRequest = 'BAD_REQUEST',
  ApiServerError = 'API_SERVER_ERROR',
  UnknownError = 'UNKNOWN_ERROR'
}

export type EmailResponseError = {
  __typename?: 'EmailResponseError';
  message: Scalars['String'];
  info?: Maybe<Scalars['String']>;
};

/** Normalized response from email API */
export type EmailResponse = {
  __typename?: 'EmailResponse';
  /** Email address of one or more recipients */
  recipient: Scalars['String'];
  sender: Scalars['String'];
  statusCode: Scalars['Int'];
  status: EmailResponseStatus;
  timestamp: Scalars['String'];
  meetId?: Maybe<Scalars['UUID']>;
  errors?: Maybe<Array<Maybe<EmailResponseError>>>;
};

/** The input needed to send an contact form email. Inlude all information relevant to the contact (such as sender name and email) in html body. */
export type SendContactFormEmailInput = {
  /** Email subject */
  subject: Scalars['String'];
  /** HTML body of email, including sender details */
  html: Scalars['String'];
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
  MeetType: MeetType;
  Meet: ResolverTypeWrapper<Meet>;
  CreateMeetInput: CreateMeetInput;
  EditMeetInput: EditMeetInput;
  Project: ResolverTypeWrapper<Project>;
  CreateProjectInput: CreateProjectInput;
  MediaAsset: ResolverTypeWrapper<MediaAsset>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  BadgeShape: BadgeShape;
  Badge: ResolverTypeWrapper<Badge>;
  CreateBadgeInput: CreateBadgeInput;
  EditBadgeInput: EditBadgeInput;
  KanbanCanon: ResolverTypeWrapper<KanbanCanon>;
  CreateKanbanCanonInput: CreateKanbanCanonInput;
  EditKanbanCanonInput: EditKanbanCanonInput;
  UpdateCardPositionInput: UpdateCardPositionInput;
  KanbanCanonCardStatusEnum: KanbanCanonCardStatusEnum;
  KanbanCanonCard: ResolverTypeWrapper<KanbanCanonCard>;
  CreateKanbanCanonCardInput: CreateKanbanCanonCardInput;
  EditKanbanCanonCardInput: EditKanbanCanonCardInput;
  KanbanCardPositions: ResolverTypeWrapper<KanbanCardPositions>;
  Kanban: ResolverTypeWrapper<Kanban>;
  CreateKanbanInput: CreateKanbanInput;
  EmailResponseStatus: EmailResponseStatus;
  EmailResponseError: ResolverTypeWrapper<EmailResponseError>;
  EmailResponse: ResolverTypeWrapper<EmailResponse>;
  SendContactFormEmailInput: SendContactFormEmailInput;
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
  Badge: Badge;
  CreateBadgeInput: CreateBadgeInput;
  EditBadgeInput: EditBadgeInput;
  KanbanCanon: KanbanCanon;
  CreateKanbanCanonInput: CreateKanbanCanonInput;
  EditKanbanCanonInput: EditKanbanCanonInput;
  UpdateCardPositionInput: UpdateCardPositionInput;
  KanbanCanonCard: KanbanCanonCard;
  CreateKanbanCanonCardInput: CreateKanbanCanonCardInput;
  EditKanbanCanonCardInput: EditKanbanCanonCardInput;
  KanbanCardPositions: KanbanCardPositions;
  Kanban: Kanban;
  CreateKanbanInput: CreateKanbanInput;
  EmailResponseError: EmailResponseError;
  EmailResponse: EmailResponse;
  SendContactFormEmailInput: SendContactFormEmailInput;
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
  badge?: Resolver<Maybe<ResolversTypes['Badge']>, ParentType, ContextType, RequireFields<QueryBadgeArgs, 'id'>>;
  kanbanCanon?: Resolver<Maybe<ResolversTypes['KanbanCanon']>, ParentType, ContextType, RequireFields<QueryKanbanCanonArgs, 'id'>>;
  kanbanCanons?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCanon']>>>, ParentType, ContextType>;
  kanbanCanonCard?: Resolver<Maybe<ResolversTypes['KanbanCanonCard']>, ParentType, ContextType, RequireFields<QueryKanbanCanonCardArgs, 'id'>>;
  kanbanCanonCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCanonCard']>>>, ParentType, ContextType, RequireFields<QueryKanbanCanonCardsArgs, 'kanbanCanonId'>>;
  kanban?: Resolver<Maybe<ResolversTypes['Kanban']>, ParentType, ContextType, RequireFields<QueryKanbanArgs, never>>;
  kanbans?: Resolver<Maybe<Array<Maybe<ResolversTypes['Kanban']>>>, ParentType, ContextType, RequireFields<QueryKanbansArgs, never>>;
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
  awardBadgesToProject?: Resolver<Maybe<ResolversTypes['Project']>, ParentType, ContextType, RequireFields<MutationAwardBadgesToProjectArgs, 'projectId' | 'badgeIds'>>;
  registerForMeet?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRegisterForMeetArgs, 'meetId'>>;
  createBadge?: Resolver<ResolversTypes['Badge'], ParentType, ContextType, RequireFields<MutationCreateBadgeArgs, 'input'>>;
  editBadge?: Resolver<ResolversTypes['Badge'], ParentType, ContextType, RequireFields<MutationEditBadgeArgs, 'id' | 'input'>>;
  deleteBadge?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBadgeArgs, 'id'>>;
  createKanbanCanon?: Resolver<ResolversTypes['KanbanCanon'], ParentType, ContextType, RequireFields<MutationCreateKanbanCanonArgs, 'input'>>;
  editKanbanCanon?: Resolver<ResolversTypes['KanbanCanon'], ParentType, ContextType, RequireFields<MutationEditKanbanCanonArgs, 'id' | 'input'>>;
  updateKanbanCanonCardPositions?: Resolver<ResolversTypes['KanbanCardPositions'], ParentType, ContextType, RequireFields<MutationUpdateKanbanCanonCardPositionsArgs, 'id' | 'input'>>;
  createKanbanCanonCard?: Resolver<ResolversTypes['KanbanCanonCard'], ParentType, ContextType, RequireFields<MutationCreateKanbanCanonCardArgs, 'input'>>;
  editKanbanCanonCard?: Resolver<ResolversTypes['KanbanCanonCard'], ParentType, ContextType, RequireFields<MutationEditKanbanCanonCardArgs, 'id' | 'input'>>;
  deleteKanbanCanonCard?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteKanbanCanonCardArgs, 'id'>>;
  createKanban?: Resolver<ResolversTypes['Kanban'], ParentType, ContextType, RequireFields<MutationCreateKanbanArgs, 'input'>>;
  updateKanbanCardPositions?: Resolver<ResolversTypes['KanbanCardPositions'], ParentType, ContextType, RequireFields<MutationUpdateKanbanCardPositionsArgs, 'id' | 'input'>>;
  deleteKanban?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteKanbanArgs, 'id'>>;
  sendContactFormEmail?: Resolver<ResolversTypes['EmailResponse'], ParentType, ContextType, RequireFields<MutationSendContactFormEmailArgs, 'input'>>;
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
  meetType?: Resolver<ResolversTypes['MeetType'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  detailedDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  badges?: Resolver<Maybe<Array<Maybe<ResolversTypes['Badge']>>>, ParentType, ContextType>;
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
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  badgeShape?: Resolver<ResolversTypes['BadgeShape'], ParentType, ContextType>;
  faIcon?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  backgroundHex?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  iconHex?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  projects?: Resolver<Maybe<Array<Maybe<ResolversTypes['Project']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanCanonResolvers<ContextType = any, ParentType extends ResolversParentTypes['KanbanCanon'] = ResolversParentTypes['KanbanCanon']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cardPositions?: Resolver<ResolversTypes['KanbanCardPositions'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  kanbanCanonCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCanonCard']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanCanonCardResolvers<ContextType = any, ParentType extends ResolversParentTypes['KanbanCanonCard'] = ResolversParentTypes['KanbanCanonCard']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  kanbanCanonId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanCardPositionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['KanbanCardPositions'] = ResolversParentTypes['KanbanCardPositions']> = {
  todo?: Resolver<Array<ResolversTypes['UUID']>, ParentType, ContextType>;
  wip?: Resolver<Array<ResolversTypes['UUID']>, ParentType, ContextType>;
  done?: Resolver<Array<ResolversTypes['UUID']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type KanbanResolvers<ContextType = any, ParentType extends ResolversParentTypes['Kanban'] = ResolversParentTypes['Kanban']> = {
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  kanbanCanonId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  meetId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  cardPositions?: Resolver<ResolversTypes['KanbanCardPositions'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  kanbanCards?: Resolver<Maybe<Array<Maybe<ResolversTypes['KanbanCanonCard']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type EmailResponseErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailResponseError'] = ResolversParentTypes['EmailResponseError']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type EmailResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailResponse'] = ResolversParentTypes['EmailResponse']> = {
  recipient?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  statusCode?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['EmailResponseStatus'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  meetId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<Maybe<ResolversTypes['EmailResponseError']>>>, ParentType, ContextType>;
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
  KanbanCanon?: KanbanCanonResolvers<ContextType>;
  KanbanCanonCard?: KanbanCanonCardResolvers<ContextType>;
  KanbanCardPositions?: KanbanCardPositionsResolvers<ContextType>;
  Kanban?: KanbanResolvers<ContextType>;
  EmailResponseError?: EmailResponseErrorResolvers<ContextType>;
  EmailResponse?: EmailResponseResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
