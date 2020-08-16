import { ValidationError } from "apollo-server-express";
import Reviews from "../../../database/models/Review";
import Users from "../../../database/models/User";
import Socket from "../../../WebSocket";
import IReview from "../../../types/IReview";
const WebSocket = Socket.getSocket();

const ReviewDeleteResolver = {
    Review: {
        // Dislike a review.
        dislike: async ({ _id: reviewId }: IReview, { userId }: { userId: string }) => {
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

export default ReviewDeleteResolver;