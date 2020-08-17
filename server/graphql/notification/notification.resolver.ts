import { ValidationError } from "apollo-server-express";
import IUser from "../../types/IUser";

const NotificationResolver = {
    User: {
        //  Runs when a User is returned and a "notification" is asked for.
        notification: async (parent: IUser, { index }: { index: number }) => {
            parent.notifications[index] || new ValidationError("The index for that notification doesn't exist.")
        }
    },
};

export default NotificationResolver;
