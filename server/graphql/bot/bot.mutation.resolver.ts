import Bots from "../../database/models/Bot";
import Users from "../../database/models/User";
import { BOT_TAGS } from "../../constants/botTags";
import { ValidationError } from "apollo-server-express";
import { getBotInviteLink } from "../../util/getBotInviteLink";
import { getBotData } from "../../util/getBotData";
import { botApproveMethods } from "../../constants/botApproveMethods";
import Socket from "../../WebSocket";
import IBot from "../../types/IBot";
import { Request } from "express";
const WebSocket = Socket.getSocket();

const BotMutationResolver = {
    Mutation: {
        // Create a bot
        createBot: async (
            _: unknown,
            {
                data,
            }: {
                data: {
                    id: string;
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
            const { id, prefix, description, owners, website, helpCommand, supportServer, library } = data;
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

        // Updates a bot from the db doesn't need every felid only updates the felids that u specify
        updateBot: async (_: unknown, { data }: { data: IBot }, { req }: { req: Request }) => {
            const { tags } = data;
            const foundBot1 = await Bots.findOne({ id: data.id });
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
        // Delete a Bot by its id.
        deleteBot: async (_: unknown, { id }: { id: string }, { req }: { req: Request }) => {
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
        // Approve/Reject a bot
        approveBot: async (_: unknown, { id, method }: { id: string; method: "approve" | "reject" }) => {
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

export default BotMutationResolver;
