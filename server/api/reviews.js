const express = require("express");
const router = express.Router();
const Reviews = require("../database/models/Review");
const Bots = require("../database/models/Bot");
const Review = require("../database/models/Review");

// Post user review -- requires Oauth to actually function --
router.post("/reviews/:id", async (req, res) => {

    const { id } = req.params;
    const { userId, review } = req.body;

    // Check if the bot exists
    const foundBot = await Bots.findOne({ id });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found."});

    // Check if the user already reviewed this bot
    const userReviewd = await Reviews.findOne({ botId: id, userId });
    if (userReviewd) return res.status(400).json({ message: "You already reviewed this bot.", error: "Bad Request." });

    const newReview = new Reviews({ botId: id, userId, review, reply: "", likes: 0, dislikes: 0 });
    try {
        newReview.save();
    } catch (err) {
        res.status(500).json({ message: "Something went wrong and the review was not saved to the database", error: "Internal Server Error." });
    }

    res.status(200).json({ message: "Successfully saved the review to the database" });

});

// Get ALL reviews for specified bot
router.get("/reviews/:id", async (req, res) => {

    const { id } = req.params;

    // Check if the bot exists or not
    const foundBot = await Bots.findOne({ id });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });

    const reviews = await Reviews.find();

    if (reviews.length === 0) return res.status(404).json({ message: "This bot has no reviews.", error: "Not Found." });
    else return res.status(200).json(reviews);

});

// Get ONE review for specified bot
router.get("/reviews/:botId/:reviewId", async (req, res) => {
    const { botId, reviewId } = req.params;

    // Check if the bot actually exists
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });

    // Check if the review exists
    const foundReview = await Review.findById({ _id: reviewId });
    if (!foundReview) return res.status(404).json({ message: "That review doesn't exist in the database.", error: "Not Found" });

    else return res.status(200).json(foundReview);

});

// Delete ONE review for specified bot
router.delete("/reviews/:botId/:reviewId", async (req, res) => {
    const { botId, reviewId } = req.params;

    // Check if the bot exists
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });

    const foundReview = await Reviews.findById(reviewId);
    if (!foundReview) return res.status(404).json({ message: "That review doesn't exist in the database.", error: "Not Found" });

    try {
        await Reviews.findByIdAndDelete(reviewId);
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the review did not delete from the database.", 
            error: "Internal Server Error."
        });
    }
    return res.status(200).json({ message: "Successfully deleted the review from the database." });
});

module.exports = router;