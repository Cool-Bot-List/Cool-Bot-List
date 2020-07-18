const mongoose = require("mongoose");
mongoose.pluralize(null);

const Config = new mongoose.Schema({
  ID: String,
  NAME: String,
  PREFIX: String,
  DESCRIPTION: String,
  OWNERS: Array,
  WEBSITE: String,
  HELP_COMMAND: String,
  SUPPORT_SERVER: String,
  LIBRARY: String,
});

module.exports = mongoose.model("BOTS", Config);
