const { ValidationError } = require("apollo-server-express");

const NotificationResolver = {
    User: {
        //  Runs when a User is returned and a "notification" is asked for.
        notification: async (parent, { index }) =>
            parent.notifications[index] || new ValidationError("The index for that notification doesn't exist."),
    },
};

module.exports = NotificationResolver;
