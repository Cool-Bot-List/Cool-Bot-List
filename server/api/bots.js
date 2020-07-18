const express = require('express');
const router = express.Router();
const Bots = require('../database/models/Bot.js');

router.post('/', async (req, res) => {
    const { ID, NAME, PREFIX, DESCRIPTION, OWNERS, WEBSITE, HELP_COMMAND, SUPPORT_SERVER, LIBRARY } = req.body;
    const Bot = await Bots.findOne({ ID });
    if (Bot) {

    }
})

module.exports = router;