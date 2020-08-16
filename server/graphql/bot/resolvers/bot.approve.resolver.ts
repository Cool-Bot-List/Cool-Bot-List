import { ValidationError } from "apollo-server-express";
import { botApproveMethods } from "../../../constants/botApproveMethods";
import Bots from "../../../database/models/Bot";
import Socket from "../../../WebSocket";
import IBot from "../../../types/IBot";
const WebSocket = Socket.getSocket();

const BotApproveResolver = {
    Bot: {
        // Approve/Reject a bot
        approve: async ({ id }: { id: string }, { method }: { method: "approve" | "reject" }) => {
            if (!id || !method) return new ValidationError("Your missing parameters.");
            console.log(method);
            if (method !== botApproveMethods.APPROVE && method !== botApproveMethods.REJECT) return new ValidationError("Invalid method paramter!");
            const foundBot = await Bots.findOne({ id });
            if (!foundBot) return new ValidationError("That bot doesn't exist in the database!");
            if (method === botApproveMethods.APPROVE) {
                foundBot.isApproved = true;
                await foundBot.save();
                WebSocket.emit("bot-update", foundBot);
            }
            if (method === botApproveMethods.REJECT) {
                foundBot.isApproved = false;
                await foundBot.deleteOne();
                WebSocket.emit("bot-delete", foundBot);
            }

            return foundBot;
        },
    },
};

export default BotApproveResolver;
