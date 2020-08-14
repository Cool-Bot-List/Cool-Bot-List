const Bots = require("../../database/models/Bot");
const Users = require("../../database/models/User");
const { BOT_TAGS } = require("../../constants/botTags");
const { ValidationError } = require("apollo-server-express");
const { getBotInviteLink } = require("../../util/getBotInviteLink");
const { getBotData } = require("../../util/getBotData");
const WebSocket = require("../../WebSocket").getSocket();

const BotMutationResolver = {
    Mutation: {
        // Create a bot
        createBot: async (_, { data }) => {
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
        updateBot: async (_, { data }, { req }) => {
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
            if (!foundBot1.owners.some((id) => id === req.user.id)) return new ValidationError("You don't have permission to perform that action.");
            WebSocket.emit("bot-update", foundBot1);
            return foundBot1;
        },
        // Delete a Bot by its id.
        deleteBot: async (_, { id }, { req }) => {
            const foundBot = await Bots.findOne({ id });
            if (!foundBot) {
                return new ValidationError("That bot doesn't exist in the database!");
            }
            if (!foundBot.owners.some((id) => id === req.user.id)) return new ValidationError("You don't have permission to perform that action.");

            const allUsers = await Users.find();
            const owners = allUsers.filter((singleUser) => singleUser.bots.includes(id));
            for (const owner of owners) {
                const users = await Users.findOne({ id: owner.id });
                users.bots.splice(
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

module.exports = BotMutationResolver;
