const { gql } = require("apollo-server-express");

const Mutations = gql`
    type Mutation {
        # Create a bot
        createBot(data: BotCreatable!): Bot
        # Updates a bot from the db doesn't need every felid only updates the felids that u specify
        updateBot(data: BotUpdatable!): Bot
        # Delete a Bot by its id.
        deleteBot(id: ID!): Bot
        # Approve/Reject a bot
        approveBot(id: ID!, method: String!): Bot

        # Create a review
        createReview(data: ReviewCreatable): Review
    }
`;

module.exports = Mutations;
