const Users = require("../../database/models/User");
const { ValidationError } = require("apollo-server-express");

const UserResolver = {
    Query: {
        //  Get ONE user based on their id.
        user: async (_, { id }) => {
            return (await Users.findOne({ id })) || new ValidationError("A user was not found!");
        },
        // Get ALL users in the db.
        users: async () => await Users.find(),
    },
    Bot: {
        // Runs when a Bot is returned and the "ownerObjs" is asked for.
        ownerObjs: async (parent) => {
            let owners = [];
            for (const userId of parent.owners) {
                owners.push(await Users.findOne({ id: userId }));
            }
            return owners;
        },
        // Runs when a Bot is returned and the "ownerObj" is asked for.
        ownerObj: async (parent, { id, index }) => {
            if (id) {
                const foundOwner = await Users.findOne({ id });
                if (foundOwner) return foundOwner;
            } else if (index) {
                const foundOwner = await Users.findOne({ id: parent.owners[index] });
                return foundOwner || new ValidationError("That User doesn't exist.");
            }
        },
    },
    Review: {
        // Runs when a Review is returned and "userObj" is asked for.
        userObj: async (parent) => {
            if (parent.userId.length === 0) null;
            return await Users.findOne({ id: parent.userId });
        },
    },
    OwnerReply: {
        // Runs when a OwnerReply is returned and "userObj" is asked for.
        userObj: async (parent) => {
            if (parent.userId.length === 0) return null;
            return await Users.findOne({ id: parent.userId });
        },
    },
};

module.exports = UserResolver;
