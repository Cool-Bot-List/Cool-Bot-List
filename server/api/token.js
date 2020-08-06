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
// Regenerate the token for a user.
// Should we call this regen or regenerate?
router.put("/regenerate/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "You are missing the id of the user you want to regenerate in your params.", error: "Bad Request." });
    const foundUser = await Users.findOne({ id });
    if (!foundUser) return res.status(404).json({ message: "A user was not found.", error: "Not Found." });

    // Logic to regenerate the token right here

    WebSocket.emit("token-update", foundUser);
    return res.status(201).json({ message: "Successfully regenerated the user's token." });
});
module.exports = router;
