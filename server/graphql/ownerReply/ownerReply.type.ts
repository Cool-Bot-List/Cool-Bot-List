import { gql } from "apollo-server-express";

const OwnerReplyType = gql`
    type OwnerReply {
        # Create an ownerReply
        create(data: OwnerReplyCreatable): OwnerReply


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
        userId: String!
        review: String!
    }
`;

export default OwnerReplyType;
