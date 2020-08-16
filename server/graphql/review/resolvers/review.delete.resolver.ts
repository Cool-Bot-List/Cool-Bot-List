import Reviews from "../../../database/models/Review";
import Bots from "../../../database/models/Bot";
import Socket from "../../../WebSocket";
const WebSocket = Socket.getSocket();
import { ValidationError } from "apollo-server-express";
import IReview from "../../../types/IReview";

const ReviewDeleteResolver = {
    Review: {
        // Delete a review
        delete: async ({ botId, _id: reviewId }: IReview) => {
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
                await foundReview.deleteOne();
                const ratings = [];
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
    },
};

export default ReviewDeleteResolver;
