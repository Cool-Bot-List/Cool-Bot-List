const express = require("express");
const router = express.Router();
const User = require("../database/models/User.js");

// post user
router.post("/", async (req, res) => {
    const { id, bio, bots } = req.body;
    if (!id || !bio || !bots) return res.status(400).json({ message: "You are missing paramaters", error: "Bad Request." });
    const user = await User.findOne({ id });
    if (user) return res.status(430).json({ message: "That user already exists" });
    const newUser = new User({ id, bio, bots });
    try {
        await newUser.save();
    } catch (err) {
    //     :: I have no idea what status code to put here, someone help lmao
        return res.status(500).json({ message: "Something went wrong and the user was not saved to the database", error: "Internal Server Error." });
    }
    return res.status(200).json({ message: "Successfully created a new user and added them to the database" });
});

// get specific user
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ id });
    if (!user) return res.status(404).json({ message: "That user doesn't exist!", error: "Not Found." });
    res.status(200).json({ user });
});

// all users ::
router.get("/", async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(404).json({ message: "There are no users in the database!", error: "Not Found." });
    res.status(200).json(users);
});

// update user
router.put("/", async (req, res) => {
    const { id, bio, bots } = req.body;
    if (!id || !bio || !bots) return res.status(400).json({ message: "You are missing paramaters", error: "Bad Request." });
    const foundUser = await User.findOneAndUpdate(req.body.id, req.body, { new: true });
    try {
        await foundUser.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the user did not save to the database!" });
    }
    return res.json({ message: "Succesfully updated the user from the database!" });
});

// delete user
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "You are missing paramaters", error: "Bad Request." });
    const foundUser = await User.findOne({ id });
    if (!foundUser) return res.status(404).json({ message: "That user doesn't exist in the database!" });
    try {
        await User.findOneAndDelete({ id });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the user did not delete from the database!", error: "Internal Server Error."
        }); 
    }
    return res.json({ message: "Succesfully deleted the user from the database!" });
});

module.exports = router;
