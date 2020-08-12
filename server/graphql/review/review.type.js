const { gql } = require("apollo-server-express");

const ReviewType = gql`
    type Review {
        userId: String!
        review: String!
        ownerReply: OwnerReply!
        likes: [String!]!
        dislikes: [String!]!
        rating: Int!
        date: String!
    }
`;
module.exports = ReviewType;
