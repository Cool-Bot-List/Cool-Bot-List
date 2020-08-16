import { gql } from "apollo-server-express";

const ReviewType = gql`
    type Review {
        # Create a Review.
        create(data: ReviewCreatable!): Review  
        # Delete a Review.
        delete: Review
         # Like a Review.
        like(userId: ID!): Review
        # Dislike a Review.
        dislike(userId: ID!): Review


        _id: ID!
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
        botId: String
    }

    input ReviewCreatable {
        userId: String!
        review: String!
        rating: Float!
    }
`;
export default ReviewType;
