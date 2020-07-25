const express = require("express");
const router = express.Router();
const Bots = require("../database/models/Bot.js");
const Users = require("../database/models/User");
const botApproveMethods = require("../constants/botApproveMethods");
const { getBotData } = require("../util/getBotData");

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
    if (!id || !prefix || !description || !owners || !website || !helpCommand || !supportServer || !library) return res.status(404).json({ msg: "Your missing some information to create the bot!" });
    const bot = await Bots.findOne({ id });
    const botApiData = await getBotData(id);
    const { tag, avatarUrl } = botApiData;
    if (bot) return res.status(400).send({ message: "This bot already exists!", error: "Bad Request." });
    const newBot = new Bots({ id, tag, avatarUrl, prefix, description, owners, website, helpCommand, supportServer, library });

    for (const owner of owners) {
        const users = await Users.findOne({ id: owner });
        // users is null ;(
        users.bots.push(id);
        try {
            await users.save();
        } catch (err) {
            return res.status(500).json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error." });
        }
    }

    try {
        await newBot.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error." });
    }

    return res.json({ message: "Successfully created a new bot in the database!" });
});
//updates a bot from the db
router.put("/", async (req, res) => {
    const foundBot = await Bots.findOneAndUpdate(req.body.id, req.body, { new: true });
    if (!foundBot.owners.some((id) => id === req.user.id)) return res.status(401).json({ message: "You don't have permission to perform that action.", error: "Unauthorized" });
    try {
        await foundBot.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error." });
    }
    return res.json({ message: "Successfully updated the bot from the database!" });
});
//changes the isApproved status
router.put("/:id/:method", async (req, res) => {
    const { id, method } = req.params;
    if (!id || !method) return res.status(400).json({ msg: "Your missing parameters.", error: "Bad Request." });
    if (method !== botApproveMethods.APPROVE || method !== botApproveMethods.REJECT) res.status(400).send({ message: "Invalid method paramter!", error: "Bad Request." });
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
        return res.status(500).json({ message: "Something went wrong and the bot did not delete from the database!", error: "Internal Server Error." });
    }
});

//delete a bot from the db
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const foundBot = await Bots.findOne({ id });
    if (!foundBot) {
        return res.status(404).json({ message: "That bot doesn't exist in the database!", error: "Not Found." });
    }
    if (!foundBot.owners.some((id) => id === req.user.id)) return res.status(401).json({ message: "You don't have permission to perform that action.", error: "Unauthorized" });

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
            return res.status(500).json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error." });
        }
    }
    try {
        await Bots.findOneAndDelete({ id });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not delete from the database!", error: "Internal Server Error." });
    }
    return res.json({ message: "Successfully deleted the bot from the database!" });
});
module.exports = router;
