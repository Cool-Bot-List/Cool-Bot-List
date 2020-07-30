const router = require("express").Router();
const Users = require("../database/models/User");
const Bots = require("../database/models/Bot");
const VOTE_TIMES = require("../constants/voteTimes");

// Get the current vote for a user -- Check if a user can vote again
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "You are missing the id parameter.", error: "Bad Request." });
    const foundUser = await Users.findOne({ id });
    if (!foundUser) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found" });
    return res.status(200).json(foundUser.vote);
});

// Post a vote to the specified bot
router.post("/", async (req, res) => {
    const { userId, botId } = req.body;

    const foundUser = await Users.findOne({ id: userId });
    const foundBot = await Bots.findOne({ id: botId });

    if (!foundUser) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found" });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found" });

    if (VOTE_TIMES.TWELVE_HOURS - (Date.now() - foundUser.vote.date.getTime()) > 0) return res.status(403).json({ message: "You can't vote again yet!", error: "Forbidden." });

    foundUser.vote.date = new Date();
    foundUser.vote.bot = foundBot.id;

    foundBot.votes += 1;

    try {
        await foundUser.updateOne(foundUser);
        await foundBot.updateOne(foundBot);
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong while saving the votes to the database.", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: `Successfully voted for ${foundBot.tag}!` });
});

module.exports = router;
