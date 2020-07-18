const express = require("express");
const router = express.Router();
const Bots = require("../database/models/Bot.js");
const Bot = require("../database/models/Bot.js");

//Need a good error codes for all of these. Please help

router.post("/", async (req, res) => {

    router.get("/:id", async (req, res) => {
        const { id } = req.params;
        if (!id) { 
            //gets all bots if no id
            const allBots = await Bots.find();
            return res.json(allBots); 
        }
        //gets 1 bot if id
        const foundBot = await Bots.findOne({ id });
        if (!foundBot) return res.status(404).json({ message: "A bot was not found!" });
        return res.json(foundBot);
    });
 
    const { id, name, prefix, description, owners, website, helpCommand, supportServer, library } = req.body;
    if (!id || !name || !prefix || !description || !owners || !website || !helpCommand ||
        !supportServer || !library) return res.status(404).json({ msg: "Your missing some information to create the bot!" });
    const bot = await Bots.findOne({ id });
    //need a good error code
    if (bot) return res.status(404).send({ message: "This bot already exists!" }); 
    const newBot = new Bots({ id, name, prefix, description, owners, website, helpCommand, supportServer, library });
    try { 
        await newBot.save();
    } catch (err) {
        return res.status(404).json({ message: "Something went wrong and the bot did not save to the database!" });
    }

    return res.json({ message: "Succesfully created a new bot in the database!" });
});


router.put("/", async (req, res ) => { 
    const foundBot = await Bots.findOneAndUpdate( req.body.id, req.body, { new: true});
    try { 
        await foundBot.save();
    } catch (err) {
        return res.status(404).json({ message: "Something went wrong and the bot did not save to the database!" });
    }
    return res.json({ message: "Succesfully created a new bot in the database!" });
});

router.delete("/:id", async (req, res) => { 
    const { id } = req.params;
    const foundBot = await Bots.findOneAndDelete({ id });
    try { 
        await foundBot.save(); 
    } catch (err) {
        return res.status(404).json({ message: "Something went wrong and the bot did not save to the database!" });
    }
    return res.json({ message: "Succesfully created a new bot in the database!" });
}); 
module.exports = router;

//https://github.com/Zyleaf/Cool-Bot-List/pull/2 for all the error codes
// ill look up some status stuff and commit in the mean time

