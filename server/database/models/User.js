const mongoose = require("mongoose");
mongoose.pluralize(null);

const Config = new mongoose.Schema({
  ID: String,
});

module.exports = mongoose.model("USERS", Config);
