const Reviews = require("../../database/models/Review");
const { ValidationError } = require("apollo-server-express");

const ReviewResolver = {
    Bot: {
        // Get ALL reviewObjs when a bot is returned.
        reviewObjs: async (parent) => {
            return (await Reviews.find()).filter((reviewObject) => reviewObject.botId === parent.id);
        },

        // Get a ONE reviewObj when a bot is returned by mongoId or array index.
        reviewObj: async (parent, { mongoId, index }) => {
            if (mongoId) {
                const foundReview = await Reviews.findOne({ botId: parent.id, _id: mongoId });
                if (foundReview) return foundReview;
            } else if (index) {
                return (
                    (await Reviews.find().filter((reviewObject) => reviewObject.botId === parent.id)[index]) ||
                    new ValidationError("A review was not found!")
                );
            }
        },
    },
};

module.exports = ReviewResolver;
