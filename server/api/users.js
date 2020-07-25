const express = require("express");
const router = express.Router();
const Users = require("../database/models/User.js");
// const getTag = require("../util/getTag.js");
// const getBotData = require("../util/getBotData.js");

// Get the currently logged in user
router.get("/@me", async (req, res) => {
    if (!req.user) return res.status(404).json({ message: "There is no user curently logged in!", error: "Not Found." });
    if (req.user) return res.status(200).json(req.user);
});

// post user
// router.post("/", async (req, res) => {

//     const { id, bio, bots } = req.body;
//     if (!id || !bio || !bots) return res.status(400).json({ message: "You are missing paramaters", error: "Bad Request." });
//     const user = await Users.findOne({ id });
//     if (user) return res.status(430).json({ message: "That user already exists" });
//     const data = await getBotData()
//     const tag = getTag()

//     const newUser = new Users({ id,  bio, bots });
//     try {
//         await newUser.save();
//     } catch (err) {
//         console.log(err, "error");
//         return res.status(500).json({ message: "Something went wrong and the user was not saved to the database", error: "Internal Server Error." });
//     }
//     return res.status(200).json({ message: "Successfully created a new user and added them to the database" });
// }); 

// get specific user
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await Users.findOne({ id });
    if (!user) return res.status(404).json({ message: "That user doesn't exist!", error: "Not Found." });
    res.status(200).json({ user });
});

// all users ::
router.get("/", async (req, res) => {
    const users = await Users.find();
    if (!users) return res.status(404).json({ message: "There are no users in the database!", error: "Not Found." });
    res.status(200).json(users);
});

// update user
router.put("/", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "You are missing the id paramater.", error: "Bad Request." });
    const foundUser = await Users.findOneAndUpdate(req.body.id, req.body, { new: true });
    try {
        await foundUser.save();
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the user did not save to the database!" });
    }
    return res.json({ message: "Succesfully updated the user from the database!" });
});
// just testing so i have a commit
// delete user
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "You are missing paramaters", error: "Bad Request." });
    const foundUser = await Users.findOne({ id });
    if (!foundUser) return res.status(404).json({ message: "That user doesn't exist in the database!" });
    try {
        await Users.findOneAndDelete({ id });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong and the user did not delete from the database!", error: "Internal Server Error." });
    }
    return res.json({ message: "Succesfully deleted the user from the database!" });
});
// this is have stupid
module.exports = router;
