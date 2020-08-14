const { gql } = require("apollo-server-express");

const BotType = gql`
    type Bot {
        id: ID!
        tag: String!
        avatarUrl: String!
        prefix: String!
        description: String!
        # Get all ownerIds for the returned bot.
        owners: [String!]!
        # Get ALL owner objects for the returned bot.
        ownerObjs: [User!]!
        # Get ONE owner object for the returned bot by userId or array index.
        ownerObj(id: ID, index: Int): User
        website: String!
        helpCommand: String!
        supportServer: String!
        library: String!
        averageRating: Float
        isApproved: Boolean
        votes: Int!
        inviteLink: String
        tags: [String!]!
        servers: Int
        users: Int
        presence: String
        # Get ALL reviewIds for the returned bot.
        reviews: [String!]!
        # Get ALL reviewObjs for the returned bot.
        reviewObjs: [Review!]!
        # Get a ONE reviewObj for the returned bot by mongoId or array index.
        reviewObj(mongoId: String, index: Int): Review
    }
    input BotCreatable {
        id: String!
        prefix: String!
        description: String!
        owners: [String!]!
        website: String!
        helpCommand: String!
        supportServer: String!
        library: String!
        inviteLink: String
        tags: [String!]!
    }

    input BotUpdatable {
        id: ID!
        tag: String
        avatarUrl: String
        prefix: String
        description: String
        owners: [String]
        website: String
        helpCommand: String
        supportServer: String
        library: String
        averageRating: Int
        isApproved: Boolean
        votes: Int
        inviteLink: String
        tags: [String]
        servers: Int
        users: Int
        presence: String
        reviews: [String]
    }
`;
module.exports = BotType;
