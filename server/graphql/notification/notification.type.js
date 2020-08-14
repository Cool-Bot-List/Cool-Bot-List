const { gql } = require("apollo-server-express");

const NotificationType = gql`
    type Notification {
        message: String!
        read: Boolean!
    }
`;

module.exports = NotificationType;
