const mongoose = require("mongoose");
mongoose.pluralize(null);

const Review = new mongoose.Schema({
    botId: String,
    userId: String,
    review: String,
    // reply: String, -- Removed for now
    likes: Number,
    dislikes: Number,
    ratings: { type: Array, default: [], required: false },
});

module.exports = mongoose.model("reviews", Review);
