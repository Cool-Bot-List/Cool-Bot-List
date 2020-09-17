import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type VoteType = {
  __typename?: 'VoteType';
  date?: Maybe<Scalars['DateTime']>;
  bot?: Maybe<BotType>;
};


export type NotificationType = {
  __typename?: 'NotificationType';
  read: Scalars['Boolean'];
  message: Scalars['String'];
};

export type UserType = {
  __typename?: 'UserType';
  id: Scalars['ID'];
  tag: Scalars['String'];
  avatarUrl: Scalars['String'];
  bio: Scalars['String'];
  bots: Array<BotType>;
  newUser: Scalars['Boolean'];
  notifications: Array<NotificationType>;
  token?: Maybe<Scalars['String']>;
  vote?: Maybe<VoteType>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  bot?: Maybe<BotType>;
};


export type UserTypeBotArgs = {
  id: Scalars['String'];
};

export type OwnerReplyType = {
  __typename?: 'OwnerReplyType';
  user: UserType;
  review: Scalars['String'];
  likes: Array<UserType>;
  dislikes: Array<UserType>;
  date?: Maybe<Scalars['DateTime']>;
  edited?: Maybe<Scalars['DateTime']>;
};

export type ReviewType = {
  __typename?: 'ReviewType';
  _id: Scalars['ID'];
  bot: BotType;
  user: UserType;
  review: Scalars['String'];
  ownerReply?: Maybe<OwnerReplyType>;
  likes: Array<UserType>;
  dislikes: Array<UserType>;
  rating: Scalars['Float'];
  date: Scalars['DateTime'];
  edited?: Maybe<Scalars['DateTime']>;
};

export type BotType = {
  __typename?: 'BotType';
  id: Scalars['ID'];
  tag: Scalars['String'];
  avatarUrl: Scalars['String'];
  prefix: Scalars['String'];
  description: Scalars['String'];
  owners: Array<UserType>;
  website: Scalars['String'];
  inviteLink?: Maybe<Scalars['String']>;
  helpCommand: Scalars['String'];
  supportServer?: Maybe<Scalars['String']>;
  library: Scalars['String'];
  averageRating?: Maybe<Scalars['Float']>;
  isApproved?: Maybe<Scalars['Boolean']>;
  reviews: Array<ReviewType>;
  votes: Scalars['Float'];
  tags: Array<Scalars['String']>;
  servers?: Maybe<Scalars['Float']>;
  users?: Maybe<Scalars['Float']>;
  presence?: Maybe<Scalars['String']>;
  owner: UserType;
  review?: Maybe<ReviewType>;
};


export type BotTypeOwnerArgs = {
  index?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['String']>;
};


export type BotTypeReviewArgs = {
  index?: Maybe<Scalars['Float']>;
  mongoId?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  reviews: Array<ReviewType>;
  review: ReviewType;
  bots?: Maybe<Array<BotType>>;
  bot?: Maybe<BotType>;
  searchForBot?: Maybe<Array<BotType>>;
  users?: Maybe<Array<UserType>>;
  user?: Maybe<UserType>;
  admins?: Maybe<Array<UserType>>;
  me: UserType;
};


export type QueryReviewArgs = {
  mongoId: Scalars['String'];
};


export type QueryBotArgs = {
  id: Scalars['String'];
};


export type QuerySearchForBotArgs = {
  query: BotSearchable;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};

export type BotSearchable = {
  name?: Maybe<Scalars['String']>;
  hasTags?: Maybe<Array<Scalars['String']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createReview: ReviewType;
  updateReview: ReviewType;
  likeReview: ReviewType;
  dislikeReview: ReviewType;
  deleteReview: ReviewType;
  createOwnerReply: OwnerReplyType;
  updateOwnerReply: OwnerReplyType;
  likeOwnerReply: OwnerReplyType;
  dislikeOwnerReply: OwnerReplyType;
  deleteOwnerReply: OwnerReplyType;
  updateNotification: NotificationType;
  updateAllNotifications: Array<NotificationType>;
  createBot: BotType;
  updateBot: BotType;
  deleteBot: BotType;
  approveBot: BotType;
  createToken: Scalars['String'];
  voteBot: VoteType;
  updateUser: UserType;
  deleteUser: UserType;
  makeAdmin: UserType;
  updateMyBot: Scalars['String'];
};


export type MutationCreateReviewArgs = {
  reviewCreatable: ReviewCreatable;
};


export type MutationUpdateReviewArgs = {
  review: Scalars['String'];
  mongoId: Scalars['String'];
};


export type MutationLikeReviewArgs = {
  userId: Scalars['String'];
  mongoId: Scalars['String'];
};


export type MutationDislikeReviewArgs = {
  userId: Scalars['String'];
  mongoId: Scalars['String'];
};


export type MutationDeleteReviewArgs = {
  mongoId: Scalars['String'];
};


export type MutationCreateOwnerReplyArgs = {
  ownerReplyCreatable: OwnerReplyCreatable;
};


export type MutationUpdateOwnerReplyArgs = {
  ownerReply: Scalars['String'];
  reviewId: Scalars['String'];
};


export type MutationLikeOwnerReplyArgs = {
  userId: Scalars['String'];
  reviewId: Scalars['String'];
};


export type MutationDislikeOwnerReplyArgs = {
  userId: Scalars['String'];
  reviewId: Scalars['String'];
};


export type MutationDeleteOwnerReplyArgs = {
  reviewId: Scalars['String'];
};


export type MutationUpdateNotificationArgs = {
  method: Scalars['String'];
  indexOrMessage: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationUpdateAllNotificationsArgs = {
  method: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationCreateBotArgs = {
  botCreatable: BotCreatable;
};


export type MutationUpdateBotArgs = {
  botUpdatable: BotUpdatable;
};


export type MutationDeleteBotArgs = {
  id: Scalars['String'];
};


export type MutationApproveBotArgs = {
  method: Scalars['String'];
  id: Scalars['String'];
};


export type MutationCreateTokenArgs = {
  id: Scalars['String'];
};


export type MutationVoteBotArgs = {
  userId: Scalars['String'];
  botId: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  userUpdatable: UserUpdatable;
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationMakeAdminArgs = {
  method: Scalars['String'];
  id: Scalars['String'];
};


export type MutationUpdateMyBotArgs = {
  botUpdatable: PublicApiBotUpdatable;
};

export type ReviewCreatable = {
  botId: Scalars['String'];
  userId: Scalars['String'];
  review: Scalars['String'];
  rating: Scalars['Float'];
};

export type OwnerReplyCreatable = {
  ownerId: Scalars['String'];
  reviewId: Scalars['String'];
  review: Scalars['String'];
};

export type BotCreatable = {
  id: Scalars['ID'];
  prefix: Scalars['String'];
  description: Scalars['String'];
  owners: Array<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  helpCommand: Scalars['String'];
  supportServer?: Maybe<Scalars['String']>;
  library: Scalars['String'];
  inviteLink?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Scalars['String']>>;
};

export type BotUpdatable = {
  id: Scalars['String'];
  tag?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  owners?: Maybe<Array<Scalars['String']>>;
  website?: Maybe<Scalars['String']>;
  helpCommand?: Maybe<Scalars['String']>;
  supportServer?: Maybe<Scalars['String']>;
  library?: Maybe<Scalars['String']>;
  averageRating?: Maybe<Scalars['Float']>;
  isApproved?: Maybe<Scalars['Boolean']>;
  votes?: Maybe<Scalars['Float']>;
  inviteLink?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Scalars['String']>>;
  servers?: Maybe<Scalars['Float']>;
  users?: Maybe<Scalars['Float']>;
  presence?: Maybe<Scalars['String']>;
  reviews?: Maybe<Array<Scalars['String']>>;
};

export type UserUpdatable = {
  id: Scalars['String'];
  tag?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  newUser?: Maybe<Scalars['Boolean']>;
};

export type PublicApiBotUpdatable = {
  client: ClientType;
  presence: PresenceType;
  sendTotalGuilds: Scalars['Boolean'];
  sendTotalUsers: Scalars['Boolean'];
  sendPresence: Scalars['Boolean'];
};

export type ClientType = {
  user: Scalars['String'];
  guilds: Array<Scalars['String']>;
  users: Array<Scalars['String']>;
};

export type PresenceType = {
  status: Scalars['String'];
};
