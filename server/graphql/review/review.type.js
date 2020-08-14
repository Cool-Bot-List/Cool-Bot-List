const { gql } = require("apollo-server-express");

const ReviewType = gql`
    type Review {
        # The userId of the returned Review.
        userId: String
        # The user object of the returned Review.
        userObj: User
        review: String!
        ownerReply: OwnerReply!
        likes: [String!]!
        dislikes: [String!]!
        rating: Float!
        date: String!
    }
    input ReviewCreatable {
        botId: String!
        userId: String!
        review: String!
        rating: Float!
    }
`;
module.exports = ReviewType;
