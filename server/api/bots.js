const express = require("express");
const router = express.Router();
const Bots = require("../database/models/Bot.js");
const Users = require("../database/models/User");
const botApproveMethods = require("../constants/botApproveMethods");
const { getBotData } = require("../util/getBotData");
const { BOT_TAGS } = require("../constants/botTags");
const { getBotInviteLink } = require("../util/getBotInviteLink");
const jwtAuth = require("../middlewares/jwtAuth");
// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");

const WebSocket = require("../WebSocket").getSocket();
// get all bots from db
router.get("/", async (req, res) => {
    const allBots = await Bots.find();
    return res.json(allBots);
});
//gets one bot based on its id
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const foundBot = await Bots.findOne({ id });
    if (!foundBot) return res.status(404).json({ message: "A bot was not found!", error: "Not Found." });
    return res.json(foundBot);
});
//posts a bot to the db
router.post("/", async (req, res) => {
    const { id, prefix, description, owners, website, helpCommand, supportServer, library } = req.body;
    let { inviteLink } = req.body;
    if (!id || !prefix || !description || !owners || !website || !helpCommand || !supportServer || !library)
        return res.status(404).json({ msg: "Your missing some information to create the bot!" });
    let { tags } = req.params;
    if (!tags) tags = [];
    // Check if the tags are valid
    if (tags.length > 3) return res.status(400).json({ message: "You cannot have more than 3 tags.", error: "Bad Request." });
    for (const t of tags) {
        // eslint-disable-next-line max-len
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
            return res.status(400).json({ message: "One or more tags are invalid!", error: "Bad Request." });
    }
    if (!inviteLink) inviteLink = getBotInviteLink(id);
    const bot = await Bots.findOne({ id });
    const botApiData = await getBotData(id);
    const { tag, avatarUrl } = botApiData;
    if (bot) return res.status(400).send({ message: "This bot already exists!", error: "Bad Request." });
    const newBot = new Bots({ id, tag, avatarUrl, prefix, description, owners, website, inviteLink, helpCommand, supportServer, library, tags });

    for (const owner of owners) {
        const users = await Users.findOne({ id: owner });
        users.bots.push(id);
        try {
            await users.save();
        } catch (err) {
            return res
                .status(500)
                .json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error." });
        }
    }

    try {
        await newBot.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error." });
    }
    WebSocket.emit("new-bot", newBot);
    return res.json({ message: "Successfully created a new bot in the database!" });
});
//updates a bot from the db doesn't need every felid only updates the felids that u specify
router.put("/", async (req, res) => {
    const { tags } = req.body;
    if (!req.body.id) return res.status(400).json({ message: "You are missing the id of the bot", error: "Bad Request." });
    const foundBot1 = await Bots.findOne({ id: req.body.id });
    if (tags) {
        if (tags.length > 3) return res.status(400).json({ message: "You cannot have more than 3 tags.", error: "Bad Request." });
        if (tags.length + foundBot1.tags.length > 3)
            return res.status(400).json({ message: "You cannot have more than 3 tags.", error: "Bad Request." });

        for (const t of tags) {
            if (foundBot1.tags.some((tag) => tag === t))
                return res.status(400).json({ message: "You can not have duplicate tags.", error: "Bad Request." });
            // eslint-disable-next-line max-len
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
                return res.status(400).json({ message: "One or more tags are invalid!", error: "Bad Request." });
        }
    }
    for (const tag of foundBot1.tags) {
        req.body.tags.push(tag);
    }
    const foundBot = await foundBot1.updateOne(req.body, { new: true });
    if (!foundBot.owners.some((id) => id === req.user.id))
        return res.status(401).json({ message: "You don't have permission to perform that action.", error: "Unauthorized" });
    try {
        await foundBot.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error." });
    }
    WebSocket.emit("bot-update", foundBot);
    return res.json({ message: "Successfully updated the bot from the database!" });
});
//changes the isApproved status
router.put("/:id/:method", async (req, res) => {
    const { id, method } = req.params;
    if (!id || !method) return res.status(400).json({ msg: "Your missing parameters.", error: "Bad Request." });
    if (method !== botApproveMethods.APPROVE || method !== botApproveMethods.REJECT)
        res.status(400).send({ message: "Invalid method paramter!", error: "Bad Request." });
    const foundBot = await Bots.findOne({ id });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database!", error: "Not Found." });
    if (method === botApproveMethods.APPROVE) foundBot.isApproved = true;
    if (method === botApproveMethods.REJECT) {
        foundBot.isApproved = false;
        await foundBot.deleteOne();
    }
    try {
        await foundBot.save();
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong and the bot did not delete from the database!", error: "Internal Server Error." });
    }
});

//delete a bot from the db
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const foundBot = await Bots.findOne({ id });
    if (!foundBot) {
        return res.status(404).json({ message: "That bot doesn't exist in the database!", error: "Not Found." });
    }
    if (!foundBot.owners.some((id) => id === req.user.id))
        return res.status(401).json({ message: "You don't have permission to perform that action.", error: "Unauthorized" });

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
            return res
                .status(500)
                .json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error." });
        }
    }
    try {
        await Bots.findOneAndDelete({ id });
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Something went wrong and the bot did not delete from the database!", error: "Internal Server Error." });
    }
    WebSocket.emit("bot-delete", foundBot);
    return res.json({ message: "Successfully deleted the bot from the database!" });
});

// Route used for users to update their bot.
router.put("/client", jwtAuth, async (req, res) => {
    /**
     * @type {Client}
     */
    const client = req.body.client;

    let { presence, sendTotalGuilds, sendTotalUsers, sendPresence } = req.body;
    if (!client || !presence || sendTotalGuilds === undefined || sendTotalUsers === undefined || sendPresence === undefined)
        return res.status(400).json({ message: "You are missing properties in the body.", error: "Bad Request." });

    const foundBot = await Bots.findOne({ id: client.user });

    if (!foundBot) return res.status(404).json({ message: "The bot was not found.", error: "Not Found." });

    sendTotalGuilds ? (sendTotalGuilds = client.guilds.length) : null;
    sendTotalUsers ? (sendTotalUsers = client.users.length) : null;
    sendPresence ? (sendPresence = presence.status) : null;

    if (sendTotalGuilds !== false) foundBot.servers = sendTotalGuilds;
    if (sendTotalUsers !== false) foundBot.users = sendTotalUsers;
    if (sendPresence !== false) foundBot.presence = sendPresence;

    try {
        await foundBot.save();
    } catch (err) {
        res.status(500).json({ message: "Something went wrong and the bot didn't update", error: "Internal Server Error." });
    }
    return res.status(201).json({ message: "Successfully updated the bot's stats." });
});

module.exports = router;
