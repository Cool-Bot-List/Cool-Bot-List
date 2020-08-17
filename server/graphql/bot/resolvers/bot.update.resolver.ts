import { ValidationError } from "apollo-server-express";
import { Request } from "express";
import { BOT_TAGS } from "../../../constants/botTags";
import Bots from "../../../database/models/Bot";
import IBot from "../../../types/IBot";
import Socket from "../../../WebSocket";
const WebSocket = Socket.getSocket();

const BotUpdateResolver = {
    Bot: {
        // Updates a bot from the db doesn't need every felid only updates the felids that u specify
        // update: async ({ id }: { id: string }, { data }: { data: IBot }, { req }: { req: Request }) => {
        update: async ({ id }: { id: string }, { data }: { data: IBot }, { req }: { req: Request }) => {
            console.log(req.user);
            const { tags } = data;
            const foundBot1 = await Bots.findOne({ id });
            if (tags) {
                if (tags.length > 3) return new ValidationError("You cannot have more than 3 tags.");
                if (tags.length + foundBot1.tags.length > 3) return new ValidationError("You cannot have more than 3 tags");

                for (const t of tags) {
                    if (foundBot1.tags.some((tag) => tag === t)) return new ValidationError("You can not have duplicate tags.");
                    if (
                        t !== BOT_TAGS.MODERATION &&
                        t !== BOT_TAGS.MUSIC &&
                        t !== BOT_TAGS.LEVELING &&
                        t !== BOT_TAGS.FUN &&
                        t !== BOT_TAGS.UTILITY &&
                        t !== BOT_TAGS.DASHBOARD &&
                        t !== BOT_TAGS.CUSTOMIZABLE &&
                        t !== BOT_TAGS.ECONOMY
                    )
                        return new ValidationError("One or more tags are invalid!");
                }
                for (const tag of foundBot1.tags) {
                    data.tags.push(tag);
                }
            }

            await foundBot1.updateOne(data, { new: true });
            //@ts-ignore
            if (!foundBot1.owners.some((id) => id === req.user.id)) return new ValidationError("You don't have permission to perform that action.");
            WebSocket.emit("bot-update", foundBot1);
            return foundBot1;
        },
    },
};

export default BotUpdateResolver;
