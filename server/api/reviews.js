const express = require("express");
const router = express.Router();
const Reviews = require("../database/models/Review");
const Bots = require("../database/models/Bot");

// Post user review -- requires Oauth to actually function --
router.post("/:id", async (req, res) => {
    const { id } = req.params;
    const { userId, review, rating } = req.body;
    //check if properties are missing from the body likes and dislikes are 0 by default
    if (!userId || !review || !rating) return res.status(400).json({ message: "You are missing paramaters", error: "Bad Request." });
    if (rating > 5) return res.status(400).json({ message: "You can't have a rating over 5 stars!", error: "Bad Request." });
    // Check if the bot exists //does the delete remove from the bots.reviews array?
    const foundBot = await Bots.findOne({ id });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });
    // why does this seem like its spelled wrong lol lmao
    // Check if the user already reviewed this bot
    const userReviewd = await Reviews.findOne({ botId: id, userId });
    if (userReviewd) return res.status(400).json({ message: "You already reviewed this bot.", error: "Bad Request." });

    const newReview = new Reviews({ botId: id, userId, review });
    foundBot.reviews.push(newReview._id);
    try {
        await newReview.save();
        await foundBot.save();
    } catch (err) {
        res.status(500).json({ message: "Something went wrong and the review was not saved to the database", error: "Internal Server Error." });
    }

    res.status(200).json({ message: "Successfully saved the review to the database" });
});

// Get ALL reviews for specified bot -- This isnt working lol cause uh i was stoopid ;)
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    // Check if the bot exists or not
    const foundBot = await Bots.findOne({ id });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });

    const tempReviews = await Reviews.find(); // woops
    const reviews = tempReviews.filter((reviewObject) => reviewObject.botId === id);

    if (reviews.length === 0) return res.status(404).json({ message: "This bot has no reviews.", error: "Not Found." });
    else return res.status(200).json(reviews);
});

// Get ONE review for specified bot
router.get("/:botId/:reviewId", async (req, res) => {
    const { botId, reviewId } = req.params;

    // Check if the bot actually exists
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });

    // Check if the review exists
    const foundReview = await Reviews.findById(reviewId);
    if (!foundReview) return res.status(404).json({ message: "That review doesn't exist in the database.", error: "Not Found" });
    else return res.status(200).json(foundReview);
});

// Delete ONE review for specified bot
router.delete("/:botId/:reviewId", async (req, res) => {
    const { botId, reviewId } = req.params;
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });
    const { reviews } = foundBot;

    reviews.splice(
        reviews.findIndex((element) => element === reviewId),
        1
    );

    try {
        // so review a bot, then delete the review right
        await foundBot.save();
        await Reviews.findByIdAndDelete(reviewId);
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the review did not delete from the database.", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully deleted the review from the database." });
});

router.put("/likes", (req, res) => {
    const { method } = req.body;
    if (!method) return res.status(400).json({ message: "You are missing properties", error: "Bad Request." });
    // if(method) {

    // }
});

module.exports = router;
