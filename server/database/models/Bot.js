const mongoose = require("mongoose");
mongoose.pluralize(null);

const Bot = new mongoose.Schema({
    id: String,
    name: String,
    prefix: String,
    description: String,
    owners: Array,
    website: String,
    helpCommand: String,
    supportServer: String,
    library: String,
    reviews: Array,
});

module.exports = mongoose.model("bots", Bot);
