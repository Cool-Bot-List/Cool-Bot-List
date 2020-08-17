import { gql } from "apollo-server-express";

const OwnerReplyType = gql`
    type OwnerReply {
        # Create an OwnerReply.
        create(data: OwnerReplyCreatable): OwnerReply
        # Delete an OwnerReply.
        delete: OwnerReply
        # Like an OwnerReply.
        like(userId: ID!): OwnerReply
        # Dislike a OwnerReply.
        dislike(userId: ID!): OwnerReply

        # The userId of the returned Review.
        userId: String
        # The user object of the returned Review.
        userObj: User
        review: String!
        likes: [String!]!
        dislikes: [String!]!
        date: String
    }
    input OwnerReplyCreatable {
        ownerId: String!
        review: String!
    }
`;

export default OwnerReplyType;
