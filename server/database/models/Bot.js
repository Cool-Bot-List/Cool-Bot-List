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
    helpCommand: String,
    supportServer: String,
    library: String,
    isApproved: { type: Boolean, default: null, required: false },
    reviews: { type: Array, default: [], required: false },
});

module.exports = mongoose.model("bots", Bot);
