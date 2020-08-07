const mongoose = require("mongoose");
mongoose.pluralize(null);

const User = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    tag: { type: String, required: true },
    avatarUrl: { type: String, default: "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png", required: false },
    bio: { type: String, default: "", required: false },
    bots: { type: Array, default: [], required: false },
    newUser: { type: Boolean, default: true, required: false },
    notifications: { type: Array, default: [], required: false },
    token: { type: String, required: false, default: null },
    vote: {
        date: { type: Date, required: false, default: null },
        bot: { type: String, required: false, default: null },
    },
});
module.exports = mongoose.model("users", User);
