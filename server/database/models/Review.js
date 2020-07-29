const mongoose = require("mongoose");
mongoose.pluralize(null);

const Review = new mongoose.Schema({
    botId: String,
    userId: String,
    review: String,
    ownerReply: {
        review: { type: String, default: "" },
        likes: { type: Array, default: [], required: false },
        dislikes: { type: Array, default: [], required: false },
        date: { type: Date, default: new Date(), required: false },
    },
    likes: { type: Array, default: [], required: false },
    dislikes: { type: Array, default: [], required: false },
    rating: Number,
    date: { type: Date, default: new Date(), required: false },
});

module.exports = mongoose.model("reviews", Review);
