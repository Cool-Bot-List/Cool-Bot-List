const express = require("express");
const router = express.Router();
const Bots = require("../database/models/Bot.js");

router.post("/", async (req, res) => {
  const { ID, NAME, PREFIX, DESCRIPTION, OWNERS, WEBSITE, HELP_COMMAND, SUPPORT_SERVER, LIBRARY } = req.body;
  const bot = await Bots.findOne({ ID });
  //need a good error code
  if (bot) return res.status(404).json({ message: "This bot already exists!" });
  const newBot = new Bots({ ID, NAME, PREFIX, DESCRIPTION, OWNERS, WEBSITE, HELP_COMMAND, SUPPORT_SERVER, LIBRARY });
  try {
    await newBot.save();
  } catch (err) {
    return res.status(404).json({ message: "Something went wrong and the bot did not save to the database!" });
  }

  return res.json({ message: "Succesfully created a new bot in the database!" });
});

module.exports = router;
