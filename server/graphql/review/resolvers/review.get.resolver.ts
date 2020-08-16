import Reviews from "../../../database/models/Review";
import { ValidationError } from "apollo-server-express";
import IBot from "../../../types/IBot";

const ReviewGetResolver = {
    Bot: {
        // Get ALL reviewObjs when a bot is returned.
        reviewObjs: async (parent: IBot) => {
            return (await Reviews.find()).filter((reviewObject) => reviewObject.botId === parent.id);
        },

        // Get a ONE reviewObj when a bot is returned by mongoId or array index.
        reviewObj: async (parent: IBot, { mongoId, index }: { mongoId: string; index: string }) => {
            if (mongoId) {
                const foundReview = await Reviews.findOne({ botId: parent.id, _id: mongoId });
                if (foundReview) return foundReview;
            } else if (index) {
                return (
                    //@ts-ignore
                    (await Reviews.find().filter((reviewObject: { botId: string; }) => reviewObject.botId === parent.id)[index]) ||
                    new ValidationError("A review was not found!")
                );
            }
        },
    },
};

export default ReviewGetResolver;