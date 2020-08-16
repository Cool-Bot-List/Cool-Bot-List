import { gql } from "apollo-server-express";

const UserType = gql`
    type User {
        # Update a User
        update(data: UserUpdatable): User!

        id: ID!
        tag: String!
        avatarUrl: String!
        bio: String!
        # Get all botIds for the returned User.
        bots: [String!]!
        # Get ALL bots for the returned User.
        botObjs: [Bot!]!
        # Get ONE bot for the returned User.
        botObj(id: ID, index: Int): Bot
        newUser: Boolean!
        # Get ALL notification objects for the returned User.
        notifications: [Notification!]!
        # Get ONE notification for the returned User by index.
        notification(index: Int): Bot
        token: String
        vote: Vote
    }
    input UserUpdatable {
        tag: String
        avatarUrl: String
        bio: String
        token: String
    }
`;

export default UserType;
