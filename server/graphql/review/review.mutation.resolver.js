const Reviews = require("../../database/models/Review");
const Bots = require("../../database/models/Bot");
const Users = require("../../database/models/User");
const WebSocket = require("../../WebSocket").getSocket();
const { ValidationError } = require("apollo-server-express");

const ReviewMutationResolver = {
    Mutation: {
        // Create a review
        createReview: async (_, { data }) => {
            const { botId, userId, review, rating } = data;
            if (rating > 5) return new ValidationError("You can't have a rating over 5 stars!");
            // Check if the bot exists
            const foundBot = await Bots.findOne({ id: botId });
            if (!foundBot) return new ValidationError("That bot doesn't exist in the database.");
            // Check if the owner is trying to review
            if (foundBot.owners.some((id) => id === userId)) return new ValidationError("You can't review your own bot.");
            // Check if the user reviewing exists in the db -- also declaring the reviewer
            const reviewer = await Users.findOne({ id: userId });
            if (!reviewer) return new ValidationError("The user reviewing this bot does not exist.");
            // Check if the user already reviewed this bot
            const userReviewd = await Reviews.findOne({ botId, userId });
            if (userReviewd) return new ValidationError("You already reviewed this bot.");

            const newReview = new Reviews({ botId, userId, review, rating });
            foundBot.reviews.push(newReview._id);
            await foundBot.save();

            for (const owner of foundBot.owners) {
                const ownerObject = await Users.findOne({ id: owner });
                ownerObject.notifications.push({ message: `${reviewer.tag} just rated your bot ${rating} stars!`, read: false });
                WebSocket.emit("new-notification", ownerObject);
                try {
                    await foundBot.save();
                    await newReview.save();
                    await ownerObject.save();
                } catch (err) {
                    console.error(err);
                    return new ValidationError("Something went wrong and the owners were not notified of the reviews.");
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
                return new ValidationError("Something went wrong and the review was not saved to the database");
            }
            WebSocket.emit("new-review", newReview);
            return newReview;
        },
    },
};

module.exports = ReviewMutationResolver;
