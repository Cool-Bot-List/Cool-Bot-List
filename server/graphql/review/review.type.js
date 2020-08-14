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
        rating: Int!
        date: String!
    }
`;
module.exports = ReviewType;
