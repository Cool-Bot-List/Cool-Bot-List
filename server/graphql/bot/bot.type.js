const { gql } = require("apollo-server-express");

const BotType = gql`
    type Bot {
        id: ID!
        tag: String!
        avatarUrl: String!
        prefix: String!
        description: String!
        owners: [ID!]!
        website: String!
        helpCommand: String!
        supportServer: String!
        library: String!
        averageRating: Int
        isApproved: Boolean
        reviews: [ID]
        votes: Int
        tags: [String]
        servers: Int
        users: Int
        presence: String
    }
`;
module.exports = BotType;
