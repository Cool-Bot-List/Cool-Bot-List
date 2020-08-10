const { gql } = require("apollo-server-express");

const BotQuery = gql`
    type Query {
        bot(id: string): Bot
    }
`;

module.exports = BotQuery;
