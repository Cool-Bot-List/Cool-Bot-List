import Reviews from "../../../database/models/Review";
import { ValidationError } from "apollo-server-express";
import IBot from "../../../types/IBot";
import IReview from "../../../types/IReview";
export let reviewObj: IReview;
const ReviewGetResolver = {
    Bot: {
        // Get ALL reviewObjs when a bot is returned.
        reviewObjs: async (parent: IBot) => (await Reviews.find()).filter((reviewObject) => reviewObject.botId === parent.id),

        // Get a ONE reviewObj when a bot is returned by mongoId or array index.
        reviewObj: async (parent: IBot, { mongoId, index }: { mongoId: string; index: number }) => {
            if (mongoId) {
                reviewObj = await Reviews.findOne({ botId: parent.id, _id: mongoId });
                module.exports = reviewObj;
                if (reviewObj) return reviewObj;
            } else if (index !== undefined && index !== null) {
                reviewObj = (await Reviews.find()).filter((reviewObject: { botId: string; }) => reviewObject.botId === parent.id)[index];
                module.exports = reviewObj;
                return reviewObj || new ValidationError("A review was not found!");

            }
        },
    },
};

export default ReviewGetResolver;