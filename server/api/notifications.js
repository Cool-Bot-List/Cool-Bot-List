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
    const { notification, method, userId } = req.body;
    if (!notification || !method || !userId) return res.status(404).json({ message: "You are missing properties.", error: "Not Found." });
});

module.exports = router;
