import { gql } from "apollo-server-express";

const BotType = gql`
    type Bot {
        # Create a Bot.
        create(data: BotCreatable!): Bot
        # Updates a Bot from the db doesn't need every felid only updates the felids that u specify
        update(data: BotUpdatable!): Bot
        # Delete a Bot by its id.
        delete(id: ID!): Bot
        # Approve/Reject a Bot.
        approve(id: ID!, method: String!): Bot

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
        averageRating: Float!
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
export default BotType;
