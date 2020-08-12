const { gql } = require("apollo-server-express");

const BotType = gql`
    type Bot {
        id: ID!
        tag: String!
        avatarUrl: String!
        prefix: String!
        description: String!
        owners: [String!]!
        website: String!
        helpCommand: String!
        supportServer: String!
        library: String!
        averageRating: Int
        isApproved: Boolean
        votes: Int!
        tags: [String!]!
        servers: Int
        users: Int
        presence: String
        reviews: [String!]!
        # Get ALL reviewObjs for the returned bot.
        reviewObjs: [Review!]!
        # Get a ONE reviewObj for the returned bot by mongoId or array index.
        reviewObj(mongoId: String, index: Int): Review
    }
`;
module.exports = BotType;
