const mongoose = require("mongoose");
mongoose.pluralize(null);

const Bot = new mongoose.Schema({
    id: String,
    tag: String,
    avatarUrl: String,
    prefix: String,
    description: String,
    owners: Array,
    website: String,
    inviteLink: String,
    helpCommand: String,
    supportServer: String,
    library: String,
    averageRating: { type: Number, default: null, required: false },
    isApproved: { type: Boolean, default: null, required: false },
    reviews: { type: Array, default: [], required: false },
    votes: { type: Number, default: 0, required: false },
    tags: { type: Array, default: [], required: false },
});

module.exports = mongoose.model("bots", Bot);
