const mongoose = require("mongoose");
mongoose.pluralize(null);

const User = new mongoose.Schema({
    id: String,
    bio: String,
    bots: Array,
});

module.exports = mongoose.model("users", User);
