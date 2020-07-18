const express = require("express");
const router = express.Router();
const Bots = require("../database/models/Bot.js");

router.post("/", async (req, res) => {
// eslint-disable-next-line no-unused-vars
    const { ID, NAME, PREFIX, DESCRIPTION, OWNERS, WEBSITE, HELP_COMMAND, SUPPORT_SERVER, LIBRARY } = req.body;
    const bot = await Bots.findOne({ ID });
    //need a good error code
    if (bot) return res.status(404).send({ message: "This bot already exists!" });
});


module.exports = router;
