const router = require("express").Router();
const Users = require("../database/models/User");
const WebSocket = require("../WebSocket").getSocket();

// Get the current token for a user.
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "You are missing the id of the user in your params.", error: "Bad Request." });
    const foundUser = await Users.findOne({ id });
    if (!foundUser) return res.status(404).json({ message: "A user was not found", error: "Not Found" });
    if (!foundUser.token) return res.status(404).json({ message: "This user doesn't have a token!", error: "Not Found" });
    res.status(200).json(foundUser.token);
});
// Create the token for an user.
router.post("/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "You are missing the id of the user to update in your params.", error: "Bad Request." });
    const foundUser = Users.findOne({ id });
    if (!id) return res.status(404).json({ message: "A user was not found", error: "Not Found." });

    // Logic to create the user's token here

    WebSocket.emit("new-token", foundUser);
    return res.status(201).json({ message: "Successfully created the user a token." });
});

module.exports = router;
