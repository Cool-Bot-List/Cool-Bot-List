const express = require("express");
const router = express.Router();
const Reviews = require("../database/models/Review");
const Bots = require("../database/models/Bot");

// Post user review -- requires Oauth to actually function --
router.post("/reviews/:id", async (req, res) => {

    const { id } = req.params;
    const { userID, review } = req.body;

    // Check if the bot exists
    const foundBot = await Bots.findOne({ id });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found."});

    // Check if the user already reviewed this bot
    const userReviewd = await Reviews.findOne({ botID: id, userID });
    if (userReviewd) return res.status(400).json({ message: "You already reviewed this bot.", error: "Bad Request." });

    const newReview = new Reviews({ botID: id, userID, review, reply: "", likes: 0, dislikes: 0 });
    try {
        newReview.save();
    } catch (err) {
        res.status(500).json({ message: "Something went wrong and the review was not saved to the database", error: "Internal Server Error." });
    }

    res.status(200).json({ message: "Successfully saved the review to the database" });

});

module.exports = router;

