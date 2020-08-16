import Reviews from "../../../database/models/Review";
import Users from "../../../database/models/User";
import Socket from "../../../WebSocket";
const WebSocket = Socket.getSocket();
import { ValidationError } from "apollo-server-express";
import IReview from "../../../types/IReview";

const ReviewLikeResolver = {
    Review: {
        // Like a Review.
        like: async ({ _id: reviewId }: IReview, { userId }: { userId: string; }) => {
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
    },
};

export default ReviewLikeResolver;