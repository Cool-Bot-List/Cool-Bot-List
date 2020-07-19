const mongoose = require("mongoose");
mongoose.pluralize(null);

const Config = new mongoose.Schema({
  id: String, //smh use lowercase
});

module.exports = mongoose.model("USERS", Config);
