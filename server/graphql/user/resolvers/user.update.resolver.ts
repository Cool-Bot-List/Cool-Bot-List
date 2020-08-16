import User from "../../../database/models/User";
import IUser from "../../../types/IUser";
import { ValidationError } from "apollo-server-express";
import Socket from "../../../WebSocket";
const WebSocket = Socket.getSocket();

const UserUpdate = {
    Mutation: {
        updateUser: async (_: unknown, { data }: { data: IUser }) => {
            const { id } = data;

            let foundUser;

            try {
                foundUser = await User.findOneAndUpdate({ id }, data, { new: true, useFindAndModify: false });
            } catch (err) {
                return new ValidationError("Something went wrong while saving to the database");
            }
            // console.log(Socket.getSocket());
            // console.log(WebSocket);
            Socket.getSocket().emit("user-update", foundUser);
            // WebSocket.emit("user-update", foundUser);
            return foundUser;
        },
    },
};

export default UserUpdate;
