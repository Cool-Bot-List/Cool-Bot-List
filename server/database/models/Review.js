const mongoose = require("mongoose");
mongoose.pluralize(null);

const Review = new mongoose.Schema({
    botId: String,
    userId: String,
    review: String, //should this be description
    ownerReply: {
        review: { type: String, default: "" },
        likes: { type: Number, default: 0, required: false },
        dislikes: { type: Number, default: 0, required: false },
    },
    likes: { type: Number, default: 0, required: false },
    dislikes: { type: Number, default: 0, required: false },
    rating: Number, //should this be stars instead
});

module.exports = mongoose.model("reviews", Review);
