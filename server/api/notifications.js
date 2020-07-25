const router = require("express").Router();
const Users = require("../database/models/User");
const notificationMethods = require("../constants/notificationMethods");

//get ALL notifications for ONE user
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    // const { reviewedUser } = req.body;

    let user = await Users.findOne({ id });
    if (!user) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found." });

    return res.status(200).json(user.notifications);
});

// Update a notification to be read or unread.
router.put("/", async (req, res) => {
    let { message, method, userId } = req.body;
    if (!message || !method || !userId) return res.status(400).json({ message: "You are missing properties.", error: "Bad Request." });
    let id = userId;
    let foundUser = await Users.findOne({ id });
    if (!foundUser) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found." });

    const notificationMessage = await foundUser.notifications.find((n) => n.message === `${message}`);

    if (!notificationMessage) return res.status(404).json({ message: "That notification doesn't exist in the database.", error: "Not Found." });
    const index = await foundUser.notifications.findIndex((n) => n.message === notificationMessage.message);

    if (method === notificationMethods.READ) {
        foundUser.notifications[index].read = true;
    }

    if (method === notificationMethods.UNREAD) {
        foundUser.notifications[index].read = false;
    }

    try {
        await foundUser.updateOne(foundUser);
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong while saving to the database.", error: "Internal Server Error." });
    }

    return res.status(200).json({ message: `Successfully set the notification to ${method}.` });
});

// Mark ALL as read
router.put("/all/:userId", async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "You are missing properties.", error: "Bad Request." });
    const foundUser = await Users.findOne({ id: userId });

    console.log(foundUser);

    if (!foundUser) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found." });

    for (const notification of foundUser.notifications) {
        notification.read = true;
    }

    try {
        await foundUser.updateOne(foundUser);
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong while saving to the database.", error: "Internal Server Error." });
    }

    return res.status(200).json({ message: "Successfully set all notification to read" });
});

module.exports = router;
