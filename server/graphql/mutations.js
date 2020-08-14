const { gql } = require("apollo-server-express");

const Mutations = gql`
    type Mutation {
        # Create a bot
        createBot(data: BotCreatable!): Bot
        updateBot(data: BotUpdatable!): Bot
        deleteBot(id: ID!): Bot
    }
`;

module.exports = Mutations;
