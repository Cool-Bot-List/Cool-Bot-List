const express = require("express");
const router = express.Router();
const Reviews = require("../database/models/Review");
const Bots = require("../database/models/Bot");
const Users = require("../database/models/User");
const likeMethods = require("../constants/likeMethods");

//add the owner reply
router.post("/", async (req, res) => {
    const { ownerReply, ownerId, botId, reviewId } = req.body;
    if (!ownerReply || !ownerId || !botId || !reviewId) return res.status(400).json({ message: "a", error: "Bad Request." });
    // Check if the bot exists
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });
    // Check to make sure it's one of the owners making the request
    // if (!foundBot.owners.includes(req.user.id)) return res.status(401).json({ message: "You don't have permission to perform that action.", error: "Unauthorized" });
    // Make sure the review exists
    const foundReview = await Reviews.findById(reviewId);
    if (!foundReview) return res.status(404).json({ message: "That review doesn't exist in the database.", error: "Not Found" });

    const userToPushTo = await Users.findOne({ id: foundReview.userId });
    const owner = await Users.findOne({ id: ownerId });
    const ownerTag = owner.tag;
    // Push notification to user
    userToPushTo.notifications.push({ message: `${ownerTag} has replied to your review!`, read: false });

    // Insert the reply
    foundReview.ownerReply.review = ownerReply;
    try {
        // Save it
        await userToPushTo.save();
        await foundReview.save();
    } catch (err) {
        res.status(500).json({ message: "Something went wrong and the reply did not post.", error: "Internal Server Error" });
    }

    res.status(200).json({ message: "Your reply has been successfully posted." });
});

//delete the owners reply
router.delete("/", async (req, res) => {
    const { ownerReply, ownerId, botId, reviewId } = req.body;
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
router.put("/likes/:method/:userId/:reviewId", async (req, res) => {
    const { method, userId, reviewId } = req.params;
    if (!method || !userId || !reviewId) return res.status(400).json({ message: "You are missing required parameters", error: "Bad Request." });
    if (method !== likeMethods.INCREMENT && method !== likeMethods.DECREMENT) return res.status(400).json({ message: "Incorrect Method", error: "Bad Request." });
    // Check if the bot exists
    const foundUser = await Users.findOne({ id: userId });
    if (!foundUser) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found." });
    // Make sure the review exists
    const foundReview = await Reviews.findById(reviewId);
    if (!foundReview) return res.status(404).json({ message: "That review doesn't exist in the database.", error: "Not Found" });
    // Make sure the owners reply exists
    if (foundReview.ownerReply.review.length === 0) return res.status(404).json({ message: "That owners reply doesn't exist in the database.", error: "Not Found" });
    // Handle method
    if (method === likeMethods.INCREMENT) {
        foundReview.ownerReply.likes.push(foundUser.id);
        // Remove the dislike of the user if dislike
        if (foundReview.ownerReply.dislikes.includes(foundUser.id)) {
            foundReview.ownerReply.dislikes.splice(
                foundReview.ownerReply.dislikes.findIndex((element) => element === foundUser.id),
                1
            );
        }
        const foundBot = await Bots.findOne({id: foundReview.botId});
        for (const owner of foundBot.owners) {
            const ownerObject = await Users.findOne({ id: owner });
            ownerObject.notifications.push({ message: `${foundUser.tag} liked your reply!`, read: false });
            await ownerObject.save();
        }
    }
    if (method === likeMethods.DECREMENT) {
        foundReview.ownerReply.likes.splice(
            foundReview.ownerReply.likes.findIndex((element) => element === foundUser.id),
            1
        );
    }
    try {
        await foundReview.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the owners reply did not handle likes in the database", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully updated the likes of the owners reply on the database." });
});

// Dislike the owners reply
router.put("/dislikes/:method/:userId/:reviewId", async (req, res) => {
    const { method, userId, reviewId } = req.params;
    if (!method || !userId || !reviewId) return res.status(400).json({ message: "You are missing required parameters", error: "Bad Request." });
    if (method !== likeMethods.INCREMENT && method !== likeMethods.DECREMENT) return res.status(400).json({ message: "Incorrect Method", error: "Bad Request." });
    // Check if the bot exists
    const foundUser = await Users.findOne({ id: userId });
    if (!foundUser) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found." });
    // Make sure the review exists
    const foundReview = await Reviews.findById(reviewId);
    if (!foundReview) return res.status(404).json({ message: "That review doesn't exist in the database.", error: "Not Found" });
    // Make sure the owners reply exists
    if (foundReview.ownerReply.review.length === 0) return res.status(404).json({ message: "That owners reply doesn't exist in the database.", error: "Not Found" });
    // Handle method
    if (method === likeMethods.INCREMENT) {
        foundReview.ownerReply.dislikes.push(foundUser.id);
        // Remove the like of the user if like.
        if (foundReview.ownerReply.likes.includes(foundUser.id)) {
            foundReview.ownerReply.likes.splice(
                foundReview.ownerReply.likes.findIndex((element) => element === foundUser.id),
                1
            );
        }
        const foundBot = await Bots.findOne({id: foundReview.botId});
        for (const owner of foundBot.owners) {
            const ownerObject = await Users.findOne({ id: owner });
            ownerObject.notifications.push({ message: `${foundUser.tag} disliked your reply 😢.`, read: false });
            await ownerObject.save();
        }
    }
    if (method === likeMethods.DECREMENT) {
        foundReview.ownerReply.dislikes.splice(
            foundReview.ownerReply.dislikes.findIndex((element) => element === foundUser.id),
            1
        );
    }
    try {
        await foundReview.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the owners reply did not handle dislikes in the database", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully updated the dislikes of the owners reply on the database." });
});

module.exports = router;
