import Reviews from "../../../database/models/Review";
import Users from "../../../database/models/User";
import Socket from "../../../WebSocket";
import { ValidationError } from "apollo-server-express";
import IReview from "../../../types/IReview";
import IBot from "../../../types/IBot";
const WebSocket = Socket.getSocket();

const OwnerReplyCreateResolver = {
    OwnerReply: {
        // Create a OwnerReply.
        // userId - The author of the original review.
        // ownerId - the person that is replying 
        create: async (_: unknown, { data }: { data: { ownerId: string; review: string } }, __: unknown, info: any) => {
            const foundBot: IBot = info.rootValue.botObj;
            const reviewId: IReview = info.rootValue.reviewObj.id;
            const { ownerId, review } = data;

            // Check to make sure it's one of the owners making the request
            //@ts-ignore
            if (!foundBot.owners.includes(ownerId))
                return new ValidationError("You don't have permission to perform that action.");

            // Check to see if the user exists
            const foundOwner = await Users.findOne({ id: ownerId });
            if (!foundOwner) return new ValidationError("The owner doesn't exist in the database!");

            // Check to see if the review exists
            const foundReview = await Reviews.findById(reviewId);

            // Push notification to user.
            const userToPushTo = await Users.findOne({ id: foundReview.userId });
            const ownerTag = foundOwner.tag;
            userToPushTo.notifications.push({ message: `${ownerTag} has replied to your review!`, read: false });
            WebSocket.emit("new-notification", userToPushTo);

            // Insert the reply, userId and date.
            foundReview.ownerReply.review = review;
            foundReview.ownerReply.userId = foundOwner.id;
            foundReview.ownerReply.date = new Date();

            try {
                // Save it
                await userToPushTo.save();
                await foundReview.save();
            } catch (err) {
                new ValidationError("Something went wrong and the reply did not post.");
            }
            WebSocket.emit("owner-reply", foundReview, foundOwner, userToPushTo);
            return foundReview.ownerReply;
        },
    },
};

export default OwnerReplyCreateResolver;