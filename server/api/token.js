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

module.exports = router;
