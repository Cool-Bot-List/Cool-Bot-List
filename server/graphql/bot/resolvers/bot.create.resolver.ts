import { ValidationError } from "apollo-server-express";
import { BOT_TAGS } from "../../../constants/botTags";
import Bots from "../../../database/models/Bot";
import Users from "../../../database/models/User";
import { getBotData } from "../../../util/getBotData";
import { getBotInviteLink } from "../../../util/getBotInviteLink";
import Socket from "../../../WebSocket";
const WebSocket = Socket.getSocket();

const BotCreateResolver = {
    Bot: {
        // Create a bot
        create: async (
            { id }: { id: string },
            {
                data,
            }: {
                data: {
                    prefix: string;
                    description: string;
                    owners: Array<string>;
                    website: string;
                    helpCommand: string;
                    supportServer: string;
                    library: string;
                    inviteLink: string;
                    tags: Array<string>;
                };
            }
        ) => {
            const { prefix, description, owners, website, helpCommand, supportServer, library } = data;
            let { inviteLink, tags } = data;
            if (!tags) tags = [];
            // Check if the tags are valid
            if (tags.length > 3) return new ValidationError("You cannot have more than 3 tags.");
            for (const t of tags) {
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
            if (!inviteLink) inviteLink = getBotInviteLink(id);
            const bot = await Bots.findOne({ id });
            const botApiData = await getBotData(id);
            const { tag, avatarUrl } = botApiData;
            if (bot) return new ValidationError("This bot already exists!");
            const newBot = new Bots({
                id,
                tag,
                avatarUrl,
                prefix,
                description,
                owners,
                website,
                inviteLink,
                helpCommand,
                supportServer,
                library,
                tags,
            });

            for (const owner of owners) {
                const users = await Users.findOne({ id: owner });
                users.bots.push(id);
                try {
                    await users.save();
                } catch (err) {
                    return new ValidationError("Something went wrong and the bot did not save to the database!");
                }
            }

            try {
                await newBot.save();
            } catch (err) {
                return new ValidationError("Something went wrong and the bot did not save to the database!");
            }
            WebSocket.emit("new-bot", newBot);
            return newBot;
        },
    },
};

export default BotCreateResolver;
