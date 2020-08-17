import IOwnerReply from "../../../types/IOwnerReply";
import Reviews from "../../../database/models/Review";
import Users from "../../../database/models/User";
import Bots from "../../../database/models/Bot";
import Socket from "../../../WebSocket";
import { ValidationError } from "apollo-server-express";
const WebSocket = Socket.getSocket();

const OwnerReplyCreateResolver = {
    OwnerReply: {
        create: async (parent: IOwnerReply, { data }: { data: { userId: string; review: string } }, _: unknown, info: any) => {
            const botId = info.rootValue.botObj.id;
            const { userId, review } = data;
            // const { } = parent;
            // // Check to see if the user exists
            // const foundUser = await Users.findOne({ id: userId });
            // if (!foundUser) return new ValidationError("That user doesn't exist in the database!");
            // // Check if the bot exists
            // const foundBot = await Bots.findOne({ id: botId });
            // if (!foundBot) return new ValidationError("That bot doesn't exist in the database.");
            // // Check to make sure it's one of the owners making the request
            // //@ts-ignore
            // if (!foundBot.owners.includes(req.user.id))
            //     return new ValidationError("You don't have permission to perform that action.");
            // // Make sure the review exists
            // const foundReview = await Reviews.findById(reviewId);
            // if (!foundReview) return new ValidationError("That review doesn't exist in the database");
            // if (foundReview.ownerReply.review.length !== 0) return new ValidationError("An owner reply already exists!");

            // const userToPushTo = await Users.findOne({ id: foundReview.userId });
            // const owner = await Users.findOne({ id: ownerId });
            // const ownerTag = owner.tag;
            // // Push notification to user
            // userToPushTo.notifications.push({ message: `${ownerTag} has replied to your review!`, read: false });
            // WebSocket.emit("new-notification", userToPushTo);

            // // Insert the reply, userId and date
            // foundReview.ownerReply.review = review;
            // foundReview.ownerReply.userId = foundUser.id;
            // foundReview.ownerReply.date = new Date();

            // try {
            //     // Save it
            //     await userToPushTo.save();
            //     await foundReview.save();
            // } catch (err) {
            //     new ValidationError("Something went wrong and the reply did not post.");
            // }
            // WebSocket.emit("owner-reply", foundReview, owner, userToPushTo);
            // new ValidationError("Your reply has been successfully posted.");
        },
    },
};

export default OwnerReplyCreateResolver;