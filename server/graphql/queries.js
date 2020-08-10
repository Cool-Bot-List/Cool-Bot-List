const { gql } = require("apollo-server-express");

const Queries = gql`
    type Query {
        Bot(id: ID!): Bot
        Bots: [Bot]
    }
`;

module.exports = Queries;
