const { gql } = require("apollo-server-express");

const OwnerReplyType = gql`
    type OwnerReply {
        userId: String!
        review: String!
        likes: [String!]!
        dislikes: [String!]!
        date: String
    }
`;

module.exports = OwnerReplyType;
