import { ValidationError } from "apollo-server-express";
import Reviews from "../../../database/models/Review";
import Socket from "../../../WebSocket";
const WebSocket = Socket.getSocket();

const OwnerReplyDeleteResolver = {

    OwnerReply: {
        // Delete an OwnerReply.
        delete: async (_: unknown, __: unknown, ___: unknown, info: any) => {
            const reviewId = info.rootValue.reviewObj.reviewObj;
            // Make sure the review exists
            const foundReview = await Reviews.findById(reviewId);
            if (!foundReview) return new ValidationError("That review doesn't exist in the database.");
            // Make sure the owners reply exists
            if (foundReview.ownerReply.review.length === 0)
                return new ValidationError("That owners reply doesn't exist in the database.");
            // Delete the reply
            foundReview.ownerReply.review = "";
            try {
                await foundReview.save();
            } catch (err) {
                return new ValidationError("Something went wrong and the owner's reply did not delete from the database.");
            }
            WebSocket.emit("owner-reply-delete", foundReview);
            return foundReview.ownerReply;
        },
    },
};

export default OwnerReplyDeleteResolver;