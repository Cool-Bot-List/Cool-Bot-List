import Users from "../../../database/models/User";
import { ValidationError } from "apollo-server-express";
import IBot from "../../../types/IBot";
import IReview from "../../../types/IReview";
import IOwnerReply from "../../../types/IOwnerReply";
import { Request } from "express";
import IUser from "../../../types/IUser";
export let userObj: IUser;
const UserGetResolver = {
    Query: {
        // Get ONE user based on their id.
        user: async (_: unknown, { id }: { id: string }) => {
            userObj = await Users.findOne({ id });
            module.exports = userObj;
            return userObj || new ValidationError("A user was not found!");
        },
        // Get ALL users in the db.
        users: async () => await Users.find(),

        // Get currently logged in user
        me: async (_: unknown, __: unknown, { req }: { req: Request }) => req.user || new ValidationError("There is no logged in user"),
    },
    Bot: {
        // Runs when a Bot is returned and the "ownerObjs" is asked for.
        ownerObjs: async (parent: IBot) => {
            const owners = [];
            for (const userId of parent.owners) {
                owners.push(await Users.findOne({ id: userId }));
            }
            return owners;
        },
        // Runs when a Bot is returned and the "ownerObj" is asked for.
        ownerObj: async (parent: IBot, { id, index }: { id: string; index: number }) => {
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
        userObj: async (parent: IReview) => {
            if (parent.userId.length === 0) null;
            return await Users.findOne({ id: parent.userId });
        },
    },
    OwnerReply: {
        // Runs when a OwnerReply is returned and "userObj" is asked for.
        userObj: async (parent: IOwnerReply) => {
            if (parent.userId.length === 0) return null;
            return await Users.findOne({ id: parent.userId });
        },
    },
};

export default UserGetResolver;
