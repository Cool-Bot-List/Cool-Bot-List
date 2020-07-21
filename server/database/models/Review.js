const mongoose = require("mongoose");
mongoose.pluralize(null);

const Review = new mongoose.Schema({
    botId: String,
    userId: String,
    review: String, //should this be description
    // reply: String, -- Removed for now
    likes: Number,
    dislikes: Number,
    rating: { type: Number, default: [], required: false }, //should this be stars instead
});
// example object
const example = {
    botId: "23984928439238492",
    userId: "1342358234958",
    review: "idk what this even is tbh",
    // reply: String, -- Removed for now
    likes: 1,
    dislikes: 2,
    ratings: 4,
};

module.exports = mongoose.model("reviews", Review);
