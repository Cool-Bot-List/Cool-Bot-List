const mongoose = require("mongoose");
mongoose.pluralize(null);

const User = new mongoose.Schema({
    id: String,
});

module.exports = mongoose.model("users", User);
