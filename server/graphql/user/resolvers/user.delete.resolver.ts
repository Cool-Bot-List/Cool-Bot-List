import User from "../../../database/models/User";
import { ValidationError } from "apollo-server-express";
import Socket from "../../../WebSocket";
const WebSocket = Socket.getSocket();

const UserDelete = {
    User: {
        delete: async ({ id }: { id: string }) => {

            const foundUser = await User.findOne({ id });
            if (!foundUser) return new ValidationError("That user doesn't exist in the database");

            try {
                await foundUser.deleteOne();
            } catch (err) {
                return new ValidationError("Something went wrong while deleting the user from the database");
            }

            WebSocket.emit("user-delete", foundUser);
            return foundUser;
        },
    },
};

export default UserDelete;