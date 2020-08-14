const User = require("../../database/models/User");
const { ValidationError } = require("apollo-server-express");
const WebSocket = require("../../WebSocket").getSocket();

const UserMutationResolver = {
    Mutation: {

        updateUser: async (_, { data }) => {
            const { id } = data;

            let foundUser;

            try {
                foundUser = await User.findOneAndUpdate({ id }, data, { new: true, useFindAndModify: false });
            } catch (err) {
                return new ValidationError("Something went wrong while saving to the database");
            }
            WebSocket.emit("user-update", foundUser);
            return foundUser;
        },

    }
}

module.exports = UserMutationResolver;