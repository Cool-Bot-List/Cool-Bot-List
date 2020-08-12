const mongoose = require("mongoose");
mongoose.pluralize(null);

const Review = new mongoose.Schema({
    botId: String,
    userId: String,
    review: String,
    ownerReply: {
        userId: { type: String, default: "", required: false },
        review: { type: String, default: "", require: false },
        likes: { type: Array, default: [], required: false },
        dislikes: { type: Array, default: [], required: false },
        date: { type: Date, default: null, required: false },
    },
    likes: { type: Array, default: [], required: false },
    dislikes: { type: Array, default: [], required: false },
    rating: Number,
    date: { type: Date, default: new Date(), required: false },
});

module.exports = mongoose.model("reviews", Review);
