const { gql } = require("apollo-server-express");

const Mutations = gql`
    type Mutation {
        # Create a Bot.
        createBot(data: BotCreatable!): Bot
        # Updates a Bot from the db doesn't need every felid only updates the felids that u specify
        updateBot(data: BotUpdatable!): Bot
        # Delete a Bot by its id.
        deleteBot(id: ID!): Bot
        # Approve/Reject a Bot.
        approveBot(id: ID!, method: String!): Bot

        # Create a Review.
        createReview(data: ReviewCreatable): Review
        # Delete a Review.
        deleteReview(botId: ID!, reviewId: ID!): Review
    }
`;

module.exports = Mutations;
