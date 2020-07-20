const express = require("express");
const router = express.Router();
const Bots = require("../database/models/Bot.js");
const Bot = require("../database/models/Bot.js");

//Need a good error codes for all of these. Please help

router.get("/", async (req, res) => {
    // get all bots from db
    const allBots = await Bots.find();
    return res.json(allBots);
});

router.get("/:id", async (req, res) => {
    //gets 1 bot if id
    const { id, } = req.params;
    const foundBot = await Bots.findOne({ id, });
    if (!foundBot) return res.status(404).json({ message: "A bot was not found!", error: "Not Found.", });
    return res.json(foundBot);
});

router.post("/", async (req, res) => {
<<<<<<< HEAD
    const { id, name, prefix, description, owners, website, helpCommand, supportServer, library, } = req.body;
    if (!id || !name || !prefix || !description || !owners || !website || !helpCommand ||
        !supportServer || !library) return res.status(404).json({ msg: "Your missing some information to create the bot!", });
    const bot = await Bots.findOne({ id, });
    //need a good error code
    if (bot) return res.status(400).send({ message: "This bot already exists!", error: "Bad Request.",}); 
    const newBot = new Bots({ id, name, prefix, description, owners, website, helpCommand, supportServer, library, });
    try { 
=======
    const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = req.body;
    if (!id || !name || !prefix || !description || !owners || !website || !helpCommand || !supportServer || !library) return res.status(404).json({ msg: "Your missing some information to create the bot!" });
    const bot = await Bots.findOne({ id });
    //need a good error code
    if (bot) return res.status(400).send({ message: "This bot already exists!", error: "Bad Request." });
    const newBot = new Bots({ id, name, prefix, description, owners, website, helpCommand, supportServer, library });
    try {
>>>>>>> 6da105af7f4e2bc28b1c063b4267437196e3f207
        await newBot.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error.", });
    }

    return res.json({ message: "Succesfully created a new bot in the database!", });
});

<<<<<<< HEAD

router.put("/", async (req, res ) => { 
    const foundBot = await Bots.findOneAndUpdate( req.body.id, req.body, { new: true,});
    try { 
=======
router.put("/", async (req, res) => {
    const foundBot = await Bots.findOneAndUpdate(req.body.id, req.body, { new: true });
    try {
>>>>>>> 6da105af7f4e2bc28b1c063b4267437196e3f207
        await foundBot.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error.", });
    }
    return res.json({ message: "Succesfully updated the bot from the database!", });
});

<<<<<<< HEAD
router.delete("/:id", async (req, res) => { 
    const { id, } = req.params;
    const foundBot = await Bot.findOne({ id, });
=======
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const foundBot = await Bot.findOne({ id });
>>>>>>> 6da105af7f4e2bc28b1c063b4267437196e3f207
    if (!foundBot) {
        return res.status(404).json({ message: "That bot doesn't exist in the database!", error: "Not Found.", });
    }
<<<<<<< HEAD
    try { 
        await Bots.findOneAndDelete({ id, });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not delete from the database!", error: "Internal Server Error.", 
        }); 
    }
    return res.json({ message: "Succesfully deleted the bot from the database!", });
}); 
module.exports = router; 



=======
    try {
        await Bots.findOneAndDelete({ id });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not delete from the database!", error: "Internal Server Error." });
    }
    return res.json({ message: "Succesfully deleted the bot from the database!" });
});
module.exports = router;
>>>>>>> 6da105af7f4e2bc28b1c063b4267437196e3f207
