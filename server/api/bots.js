const express = require("express");
const router = express.Router();
const Bots = require("../database/models/Bot.js");

//Need a good error codes for all of these. Please help

router.get("/", async (req, res) => {
    // get all bots from db
    const allBots = await Bots.find();
    return res.json(allBots);
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const foundBot = await Bots.findOne({ id });
    if (!foundBot) return res.status(404).json({ message: "A bot was not found!", error: "Not Found." });
    return res.json(foundBot);
});

router.post("/", async (req, res) => {
    const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = req.body;
    if (!id || !name || !prefix || !description || !owners || !website || !helpCommand ||
        !supportServer || !library) return res.status(404).json({ msg: "Your missing some information to create the bot!" });
    const bot = await Bots.findOne({ id });
    //need a good error code
    if (bot) return res.status(400).send({ message: "This bot already exists!", error: "Bad Request."}); 
    const newBot = new Bots({ id, name, prefix, description, owners, website, helpCommand, supportServer, library });
    try { 
        await newBot.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error." });
    }

    return res.json({ message: "Succesfully created a new bot in the database!" });
});


router.put("/", async (req, res ) => { 
    const foundBot = await Bots.findOneAndUpdate( req.body.id, req.body, { new: true});
    try { 
        await foundBot.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not save to the database!", error: "Internal Server Error." });
    }
    return res.json({ message: "Succesfully updated the bot from the database!" });
});

router.delete("/:id", async (req, res) => { 
    const { id } = req.params;
    const foundBot = await Bot.findOne({ id });
    if (!foundBot) {
        return res.status(404).json({ message: "That bot doesn't exist in the database!", error: "Not Found." });
    }
    try { 
        await Bots.findOneAndDelete({ id });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the bot did not delete from the database!", error: "Internal Server Error." }); 
    }
    return res.json({ message: "Succesfully deleted the bot from the database!" });
}); 
module.exports = router; 



