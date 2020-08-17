import { ValidationError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import Users from "../../../database/models/User";
import IUser from "../../../types/IUser";
import Socket from "../../../WebSocket";
const WebSocket = Socket.getSocket();

const TokenCreateResolver = {
    User: {
        createToken: async ({ id }: IUser) => {
            const foundUser = await Users.findOne({ id });
            if (!foundUser) return new ValidationError("A user was not found");

            const user = { id: foundUser.id };
            const token = jwt.sign({ user }, process.env.JWT_SECRET);
            try {
                foundUser.token = token;
                await foundUser.save();
            } catch (err) {
                console.log(err);
                return new ValidationError("Something went wrong while generating a token.");
            }
            WebSocket.emit("new-token", foundUser);
            return foundUser;
        },
    },
};

export default TokenCreateResolver;