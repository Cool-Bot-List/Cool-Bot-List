import { ValidationError } from "apollo-server-express";
import { Request } from "express";
import Bots from "../../../database/models/Bot";
import Users from "../../../database/models/User";
import Socket from "../../../WebSocket";
const WebSocket = Socket.getSocket();

const BotDeleteResolver = {
    Bot: {
        // Delete a Bot by its id.
        delete: async ({ id }: { id: string }, { request: req }: { request: Request }) => {
            const foundBot = await Bots.findOne({ id });
            if (!foundBot) {
                return new ValidationError("That bot doesn't exist in the database!");
            }
            //@ts-ignore
            if (!foundBot.owners.some((id) => id === req.user.id)) return new ValidationError("You don't have permission to perform that action.");
            const allUsers = await Users.find();
            const owners = allUsers.filter((singleUser) => singleUser.bots.includes(id));
            for (const owner of owners) {
                const users = await Users.findOne({ id: owner.id });
                users.bots.splice(
                    //@ts-ignore
                    users.bots.findIndex((element) => element === owner),
                    1
                );
                try {
                    await users.save();
                } catch (err) {
                    return new ValidationError("Something went wrong and the bot did not save to the database!");
                }
            }
            try {
                await Bots.findOneAndDelete({ id });
            } catch (err) {
                return new ValidationError("Something went wrong and the bot did not delete from the database!");
            }
            WebSocket.emit("bot-delete", foundBot);
            return foundBot;
        },
    },
};

export default BotDeleteResolver;
