import { ValidationError } from "apollo-server-express";
import Bots from "../../../database/models/Bot";
import Reviews from "../../../database/models/Review";
import Users from "../../../database/models/User";
import Socket from "../../../WebSocket";
const WebSocket = Socket.getSocket();

const OwnerReplyLikeResolver = {
    OwnerReply: {
        // Like an OwnerReply.
        like: async (_: unknown, { userId }: { userId: string }, __: unknown, info: any) => {
            const reviewId = info.rootValue.reviewObj;

            // Check if the user exists
            const foundUser = await Users.findOne({ id: userId });
            if (!foundUser) return new ValidationError("That user doesn't exist in the database.");
            // Make sure the review exists
            const foundReview = await Reviews.findById(reviewId);
            if (!foundReview) return new ValidationError("That review doesn't exist in the database.");
            // Make sure the owners reply exists
            if (foundReview.ownerReply.review.length === 0)
                return new ValidationError("That owners reply doesn't exist in the database.");
            // Handle method
            let liked = null;
            if (!foundReview.ownerReply.likes.includes(foundUser.id)) {
                foundReview.ownerReply.likes.push(foundUser.id);
                // Remove the dislike of the user if dislike
                if (foundReview.ownerReply.dislikes.includes(foundUser.id)) {
                    foundReview.ownerReply.dislikes.splice(
                        foundReview.ownerReply.dislikes.findIndex((element) => element === foundUser.id),
                        1
                    );
                }
                const foundBot = await Bots.findOne({ id: foundReview.botId });
                for (const owner of foundBot.owners) {
                    const ownerObject = await Users.findOne({ id: owner });
                    ownerObject.notifications.push({ message: `${foundUser.tag} liked your reply!`, read: false });
                    await ownerObject.save();
                    WebSocket.emit("new-notification", ownerObject);
                }
                liked = true;
            } else if (foundReview.ownerReply.likes.includes(foundUser.id)) {
                liked = false;
                foundReview.ownerReply.likes.splice(
                    foundReview.ownerReply.likes.findIndex((element) => element === foundUser.id),
                    1
                );
            }
            try {
                await foundReview.save();
            } catch (err) {
                return new ValidationError("Something went wrong and the owners reply did not handle likes in the database");
            }

            WebSocket.emit("owner-like", foundReview, foundUser, liked);

            return foundReview.ownerReply;
        },
    },
};

export default OwnerReplyLikeResolver;