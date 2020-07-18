const express = require("express");
const router = express.Router();
const Bots = require("../database/models/Bot.js");

router.post("/", async (req, res) => {
// eslint-disable-next-line no-unused-vars
    const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = req.body;
    const bot = await Bots.findOne({ id });
    //need a good error code
    if (bot) return res.status(404).send({ message: "This bot already exists!" });
});


module.exports = router;
