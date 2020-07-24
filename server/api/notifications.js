const router = require("express").Router();
const Users = require("../database/models/User");
const notificationMethods = require("../constants/notificationMethods");

//get ALL notifications for ONE user
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    // const { reviewedUser } = req.body;

    const user = await Users.findOne({ id });
    if (!user) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found." });

    return res.status(200).json(user.notifications);
});

router.put("/", async (req, res) => {
    const { message, method, userId } = req.body;
    if (!message || !method || !userId) return res.status(400).json({ message: "You are missing properties.", error: "Bad Request." });

    const user = await Users.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found." });

    console.log(message);
    const notificationMessage = user.notifications.find(n => n.message === `${message}`);
    // console.log(user.notifications);
    console.log(notificationMessage);
    if (!notificationMessage) return res.status(404).json({ message: "That notification doesn't exist in the database.", error: "Not Found." });

    if (method === notificationMethods.READ) {
        notificationMessage.read = true;
    }
    if (method === notificationMethods.UNREAD) {
        notificationMessage.read = false;
    }

    console.log(notificationMessage, "after");
    try {
        await user.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong while saving to the database.", error: "Internal Server Error." });
    }

    return res.status(200).json({ message: `Successfully set the notification to ${method}.` });
});

module.exports = router;
