const express = require("express");
const router = express.Router();
const Reviews = require("../database/models/Review");
const Bots = require("../database/models/Bot");
const Users = require("../database/models/User");
// const { getTag } = require("../util/getTag");

// Post user review -- requires Oauth to actually function --
router.post("/", async (req, res) => {
    const { botId, userId, review, rating } = req.body;
    //check if properties are missing from the body likes and dislikes are 0 by default
    if (!userId || !review || !rating || !botId) return res.status(400).json({ message: "You are missing parameters", error: "Bad Request." });
    if (rating > 5) return res.status(400).json({ message: "You can't have a rating over 5 stars!", error: "Bad Request." });
    // Check if the bot exists //does the delete remove from the bots.reviews array?
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "That bot doesn't exist in the database.", error: "Not Found." });

    // Check if the owner is trying to review
    if (foundBot.owners.some((id) => id === userId)) return res.status(403).json({ message: "You can't review your own bot.", error: "Forbidden" });

    // Check if the user reviewing exists in the db -- also declaring the reviewer
    const reviewer = await Users.findOne({ id: userId });
    if (!reviewer) return res.status(404).json({ message: "The user reviewing this bot does not exist.", error: "Not Found." });

    // Check if the user already reviewed this bot
    const userReviewd = await Reviews.findOne({ botId, userId });
    if (userReviewd) return res.status(400).json({ message: "You already reviewed this bot.", error: "Bad Request." });

    const newReview = new Reviews({ botId, userId, review, rating });
    foundBot.reviews.push(newReview._id);
    await foundBot.save();

    for (const owner of foundBot.owners) {
        const ownerObject = await Users.findOne({ id: owner });
        ownerObject.notifications.push({ message: `${reviewer.tag} just rated your bot ${rating} stars!`, read: false });
        try {
            await newReview.save();
            await ownerObject.save();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong and the owners were not notified of the reviews.", error: "Internal Server Error." });
        }
    }

    const foundAfterUpdateBot = await Bots.findOne({ id: botId });

    const { reviews } = foundAfterUpdateBot;
    let ratings = [];
    for (const review of reviews) {
        const foundReview = await Reviews.findById(review);

        ratings.push(foundReview.rating);
    }

    let averageRating;
    if (ratings.length === 1) averageRating = ratings[0];
    else averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
    foundBot.averageRating = averageRating;
    try {
        await foundBot.save();
    } catch (err) {
        res.status(500).json({ message: "Something went wrong and the review was not saved to the database", error: "Internal Server Error." });
    }

    res.status(200).json({ message: "Successfully saved the review to the database" });
});

// Get ALL reviews for specified bot -- This isnt working lol cause uh i was stoopid ;) //does it still not work or is this fixed i mean
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
// Get AVERAGE rating for specified bot
router.get("/average-rating/:botId/", async (req, res) => {
    const { botId } = req.params;
    if (!botId) return res.status(400).json({ message: "You are missing a botId paramter.", error: "Bad Request." });
    const foundBot = await Bots.findOne({ id: botId });
    if (!foundBot) return res.status(404).json({ message: "The bot doesn't exist in the database", error: "Not Found." });
    const { reviews } = foundBot;
    if (!reviews) return res.status(404).json({ message: "This bot doesn't have any reviews", error: "Not Found." });
    let ratings = [];
    for (const review of reviews) {
        const foundReview = await Reviews.findById(review);
        ratings.push(foundReview.rating);
    }
    const averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
    return res.status(200).json(averageRating);
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
        // so review a bot, then delete the review
        await foundBot.save();
        await Reviews.findByIdAndDelete(reviewId);
        let ratings = [];
        const updatedBot = await Bots.findOne({ id: botId });
        const { reviews } = updatedBot;
        //something is null please fix
        for (const review of reviews) {
            const foundReview = await Reviews.findById(review);
            ratings.push(foundReview.rating);
        }

        let averageRating;
        if (ratings.length === 1) averageRating = ratings[0];
        else if (ratings.length === 0) averageRating = null;
        else averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
        foundBot.averageRating = averageRating;
        await foundBot.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong and the review did not delete from the database.", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully deleted the review from the database." });
});

//like the review
router.put("/likes/:userId/:reviewId", async (req, res) => {
    const { userId, reviewId } = req.params;

    const foundReview = await Reviews.findById(reviewId);
    const foundUser = await Users.findOne({ id: userId });
    if (!foundReview || !foundUser) return res.status(404).json({ message: "A user or a review does not exist", error: "Not found." });
    const userToPushTo = await Users.findOne({ id: foundReview.userId });
    if (!foundReview.likes.includes(foundUser.id)) {
        foundReview.likes.push(foundUser.id);
        // Remove the dislike of the user if dislike
        if (foundReview.dislikes.includes(foundUser.id)) {
            foundReview.dislikes.splice(
                foundReview.dislikes.findIndex((element) => element === foundUser.id),
                1
            );
        }
        userToPushTo.notifications.push({ message: `${foundUser.tag} liked your review!`, read: false }); // did notis here, ill work on ownerReply notis, you can do dislike
    } else if (foundReview.likes.includes(foundUser.id)) {
        foundReview.likes.splice(
            foundReview.likes.findIndex((element) => element === foundUser.id),
            1
        );
    }
    try {
        await userToPushTo.save();
        await foundReview.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the review did not handle likes in the database.", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully updated the likes of the review on the database." });
});

//dislike the review
router.put("/dislikes/:userId/:reviewId", async (req, res) => {
    // this one needs to be async too dum dum
    const { userId, reviewId } = req.params;
    if (!userId || !reviewId) return res.status(400).json({ message: "You are missing properties", error: "Bad Request." });

    const foundReview = await Reviews.findById(reviewId);
    const foundUser = await Users.findOne({ id: userId });
    if (!foundReview || !foundUser) return res.status(404).json({ message: "A user or a review does not exist", error: "Not found." });
    const userToPushTo = await Users.findOne({ id: foundReview.userId });

    if (!foundReview.dislikes.includes(foundUser.id)) {
        foundReview.dislikes.push(foundUser.id);
        // Remove the like of the user if like.
        if (foundReview.likes.includes(foundUser.id)) {
            foundReview.likes.splice(
                foundReview.likes.findIndex((element) => element === foundUser.id),
                1
            );
        }
        userToPushTo.notifications.push({ message: `${foundUser.tag} disliked your review 😢.`, read: false });
    } else if (foundReview.dislikes.includes(foundUser.id)) {
        foundReview.dislikes.splice(
            foundReview.dislikes.findIndex((element) => element === foundUser.id),
            1
        );
    }
    try {
        await userToPushTo.save();
        await foundReview.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the review did not handle dislikes in the database.", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully updated the dislikes of the review on the database." });
});

module.exports = router;
