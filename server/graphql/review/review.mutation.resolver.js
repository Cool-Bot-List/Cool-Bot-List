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

        // Delete a review
        deleteReview: async (_, { botId, reviewId }) => {
            const foundBot = await Bots.findOne({ id: botId });
            if (!foundBot) return new ValidationError("That bot doesn't exist in the database.");
            const { reviews } = foundBot;
            reviews.splice(
                reviews.findIndex((element) => element === reviewId),
                1
            );
            const foundReview = await Reviews.findById(reviewId);

            if (!foundReview) return new ValidationError("The review doesn't exist.");

            try {
                await foundBot.save();
                await foundReview.delete();
                let ratings = [];
                const updatedBot = await Bots.findOne({ id: botId });
                const { reviews } = updatedBot;

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
                return new ValidationError("Something went wrong and the review did not delete from the database.");
            }
            WebSocket.emit("review-delete", foundReview);
            return foundReview;
        },
        // Like a Review.
        likeReview: async (_, { userId, reviewId }) => {
            const foundReview = await Reviews.findById(reviewId);
            const foundUser = await Users.findOne({ id: userId });
            if (!foundReview || !foundUser) return new ValidationError("A user or a review does not exist");
            const userToPushTo = await Users.findOne({ id: foundReview.userId });
            let like = null;
            if (!foundReview.likes.includes(foundUser.id)) {
                foundReview.likes.push(foundUser.id);
                // Remove the dislike of the user if dislike

                if (foundReview.dislikes.includes(foundUser.id)) {
                    foundReview.dislikes.splice(
                        foundReview.dislikes.findIndex((element) => element === foundUser.id),
                        1
                    );
                }
                userToPushTo.notifications.push({ message: `${foundUser.tag} liked your review!`, read: false });
                WebSocket.emit("new-notification", userToPushTo);
                like = true;
            } else if (foundReview.likes.includes(foundUser.id)) {
                foundReview.likes.splice(
                    foundReview.likes.findIndex((element) => element === foundUser.id),
                    1
                );
                like = false;
            }
            try {
                await userToPushTo.save();
                await foundReview.save();
            } catch (err) {
                return new ValidationError("Something went wrong and the review did not handle likes in the database.");
            }
            WebSocket.emit("review-like", foundReview, foundUser, userToPushTo, like);
            return foundReview;
        },

        // Dislike a review.
        dislikeReview: async (_, { userId, reviewId }) => {
            const foundReview = await Reviews.findById(reviewId);
            const foundUser = await Users.findOne({ id: userId });
            if (!foundReview || !foundUser) return new ValidationError("A user or a review does not exist");
            const userToPushTo = await Users.findOne({ id: foundReview.userId });
            let dislike = null;
            if (!foundReview.dislikes.includes(foundUser.id)) {
                foundReview.dislikes.push(foundUser.id);
                // Remove the like of the user if like.
                if (foundReview.likes.includes(foundUser.id)) {
                    foundReview.likes.splice(
                        foundReview.likes.findIndex((element) => element === foundUser.id),
                        1
                    );
                    dislike = true;
                }
                userToPushTo.notifications.push({ message: `${foundUser.tag} disliked your review 😢.`, read: false });
                WebSocket.emit("new-notification", userToPushTo);
            } else if (foundReview.dislikes.includes(foundUser.id)) {
                foundReview.dislikes.splice(
                    foundReview.dislikes.findIndex((element) => element === foundUser.id),
                    1
                );
                dislike = false;
            }
            try {
                await userToPushTo.save();
                await foundReview.save();
            } catch (err) {
                return new ValidationError("Something went wrong and the review did not handle dislikes in the database.");
            }
            WebSocket.emit("review-dislike", foundReview, foundUser, userToPushTo, dislike);
            return foundReview;
        },
    },
};

module.exports = ReviewMutationResolver;
