import { gql } from "apollo-server-express";

const NotificationType = gql`


    type Notification {

        update(method: String!): Notification!

        message: String!
        read: Boolean!
    }
`;

export default NotificationType;
