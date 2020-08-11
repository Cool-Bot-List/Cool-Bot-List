const { gql } = require("apollo-server-express");

const Queries = gql`
    type Query {
        # Get ONE bot based on its id.
        Bot(id: ID!): Bot
        # Get ALL bots in the db.
        Bots: [Bot]
    }
`;

module.exports = Queries;
