const { gql } = require("apollo-server-express");

const Queries = gql`
    type Query {
        # Get ONE bot based on its id.
        bot(id: ID!): Bot
        # Get ALL bots in the db.
        bots: [Bot]
    }
`;

module.exports = Queries;
