const express = require("express");
const router = express.Router();
const Reviews = require("../database/models/Review");
const Bots = require("../database/models/Bot");
const likeMethods = require("../constants/likeMethods");
const Users = require("../database/models/User");
// const { getTag } = require("../util/getTag");

// Post user review -- requires Oauth to actually function --
router.post("/:id", async (req, res) => {
    const botId = req.params.id;
    const { userId, review, rating } = req.body;
    //check if properties are missing from the body likes and dislikes are 0 by default
    if (!userId || !review || !rating || !botId) return res.status(400).json({ message: "You are missing paramaters", error: "Bad Request." });
    if (rating > 5) return res.status(400).json({ message: "You can't have a rating over 5 stars!", error: "Bad Request." });
    // Check if the bot exists //does the delete remove from the bots.reviews array?
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });

    // Check if the owner is trying to review
    if (foundBot.owners.some((id) => id === userId)) return res.status(403).json({ message: "You can't review your own bot.", error: "Forbidden" });

    // Check if the user reviewing exists in the db -- also declaring the reviewer
    const reviewer = await Users.findOne({ id: userId });
    console.log(reviewer);
    if (!reviewer) return res.status(404).json({ message: "The user reviewing this bot does not exist.", error: "Not Found." });

    // Check if the user already reviewed this bot
    const userReviewd = await Reviews.findOne({ botId, userId });
    if (userReviewd) return res.status(400).json({ message: "You already reviewed this bot.", error: "Bad Request." });

    const newReview = new Reviews({ botId, userId, review, rating });
    foundBot.reviews.push(newReview._id);


    for (const owner of foundBot.owners) {
        const ownerObject = await Users.findOne({ id: owner });
        ownerObject.notifications.push({ message: `${reviewer.tag} just rated your bot ${rating} stars!`, read: false });
        try {
            await ownerObject.save();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong and the owners were not notified of the reviews.", error: "Internal Server Error." });
        }
    }

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

//add the owner reply
router.put("owner-reply/:botId/:reviewId", async (req, res) => {
    const { botId, reviewId } = req.params;
    const { ownerReply, ownerId } = req.body;
    if (!ownerReply || !ownerId || botId || reviewId) return res.status(400).json({ message: "You are missing required parameters", error: "Bad Request." });
    // Check if the bot exists
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });
    // Check to make sure it's one of the owners making the request
    if (!foundBot.owners.includes(req.user.id)) return res.status(401).json({ message: "You don't have permission to perform that action.", error: "Unauthorized" });
    // Make sure the review exists
    const foundReview = await Reviews.findById(reviewId);
    if (!foundReview) return res.status(404).json({ message: "That review doesn't exist in the database.", error: "Not Found" });
    // Insert the reply
    foundReview.ownerReply.review = ownerReply;
    try {
        // Save it
        await foundReview.save();
    } catch (err) {
        res.status(500).json({ message: "Something wen't wrong and the reply did not post.", error: "Internal Server Error" });
    }

    res.status(200).json({ message: "Your reply has been successfully posted." });
});
//delete the owners reply
router.delete("owner-reply/:botId/:reviewId", async (req, res) => {
    const { botId, reviewId } = req.params;
    const { ownerReply, ownerId } = req.body;
    if (!ownerReply || !ownerId || botId || reviewId) return res.status(400).json({ message: "You are missing required parameters", error: "Bad Request." });
    // Check if the bot exists
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });
    // Check to make sure it's one of the owners making the request
    if (!foundBot.owners.includes(req.user.id)) return res.status(401).json({ message: "You don't have permission to perform that action.", error: "Unauthorized" });
    // Make sure the review exists
    const foundReview = await Reviews.findById(reviewId);
    if (!foundReview) return res.status(404).json({ message: "That review doesn't exist in the database.", error: "Not Found" });
    // Make sure the owners reply exists
    if (foundReview.ownerReply.review.length === 0) return res.status(404).json({ message: "That owners reply doesn't exist in the database.", error: "Not Found" });
    // Delete the reply
    foundReview.ownerReply.review = "";
    try {
        await foundReview.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the owner's reply did not delete from the database.", error: "Internal Server Error." });
    }

    return res.status(200).json({ message: "Successfully deleted the owner's reply from the database." });
});
// Like the owners reply
router.put("owner-reply/like/:method/:botId/:reviewId", async (req, res) => {
    const { method, botId, reviewId } = req.params;
    if (!method || !botId || !reviewId) return res.status(400).json({ message: "You are missing required parameters", error: "Bad Request." });
    // Check if the bot exists
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });
    // Make sure the review exists
    const foundReview = await Reviews.findById(reviewId);
    if (!foundReview) return res.status(404).json({ message: "That review doesn't exist in the database.", error: "Not Found" });
    // Make sure the owners reply exists
    if (foundReview.ownerReply.review.length === 0) return res.status(404).json({ message: "That owners reply doesn't exist in the database.", error: "Not Found" });
    // Handle method
    if (method === likeMethods.INCREMENT) {
        foundReview.ownerReply.likes = foundReview.ownerReply.likes + 1;
    }
    if (method === likeMethods.DECREMENT) {
        foundReview.ownerReply.likes = foundReview.ownerReply.likes - 1;
    }
    try {
        await foundReview.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the owners reply did not handle likes in the database", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully updated the likes of the owners reply on the database." });
});
// Dislike the owners reply
router.put("owner-reply/dislike/:method/:botId/:reviewId", async (req, res) => {
    const { method, botId, reviewId } = req.params;
    if (!method || !botId || !reviewId) return res.status(400).json({ message: "You are missing required parameters", error: "Bad Request." });
    // Check if the bot exists
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });
    // Make sure the review exists
    const foundReview = await Reviews.findById(reviewId);
    if (!foundReview) return res.status(404).json({ message: "That review doesn't exist in the database.", error: "Not Found" });
    // Make sure the owners reply exists
    if (foundReview.ownerReply.review.length === 0) return res.status(404).json({ message: "That owners reply doesn't exist in the database.", error: "Not Found" });
    // Handle method
    if (method === likeMethods.INCREMENT) {
        foundReview.ownerReply.dislikes = foundReview.ownerReply.dislikes + 1;
    }
    if (method === likeMethods.DECREMENT) {
        foundReview.ownerReply.dislikes = foundReview.ownerReply.dislikes - 1;
    }
    try {
        await foundReview.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the owners reply did not handle dislikes in the database", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully updated the dislikes of the owners reply on the database." });
});

//like the review
router.put("/likes/:method/:reviewId", async (req, res) => {
    const { method, reviewId } = req.params;
    if (!method || !reviewId) return res.status(400).json({ message: "You are missing properties", error: "Bad Request." });
    if (method !== likeMethods.INCREMENT || method !== likeMethods.DECREMENT) return res.status(400).json({ message: "You are missing properties", error: "Bad Request." });
    const foundReview = await Reviews.findById(reviewId);

    if (method === likeMethods.INCREMENT) {
        foundReview.likes = foundReview.likes + 1;
    }
    if (method === likeMethods.DECREMENT) {
        foundReview.likes = foundReview.likes - 1;
    }
    try {
        await foundReview.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the review did not handle likes in the database.", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully updated the likes of the review on the database." });
});

//dislike the review
router.put("/dislikes/:method/:reviewId", async (req, res) => {
    // this one needs to be async too dum dum
    const { method, reviewId } = req.params;
    if (!method || !reviewId) return res.status(400).json({ message: "You are missing properties", error: "Bad Request." });
    if (method !== likeMethods.INCREMENT || method !== likeMethods.DECREMENT) return res.status(400).json({ message: "You are missing properties", error: "Bad Request." });

    const foundReview = await Reviews.findById(reviewId);
    if (method === likeMethods.INCREMENT) {
        foundReview.likes = foundReview.dislikes + 1;
    }
    if (method === likeMethods.DECREMENT) {
        foundReview.likes = foundReview.dislikes - 1;
    }
    try {
        await foundReview.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the review did not handle dislikes in the database.", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully updated the dislikes of the review on the database." });
});

module.exports = router;
