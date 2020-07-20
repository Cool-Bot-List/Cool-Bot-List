const mongoose = require("mongoose");
mongoose.pluralize(null);

const Review = new mongoose.Schema({
    botID: String,
    userID: String,
    review: String,
    // reply: String, -- Removed for now
    likes: Number,
    dislikes: Number,
});

module.exports = mongoose.model("reviews", Review);