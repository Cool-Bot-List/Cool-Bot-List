const router = require("express").Router();
const Users = require("../database/models/User");

router.get("/:id", async (req, res) => {

    const { id } = req.params;
    // const { reviewedUser } = req.body;

    const user = await Users.findOne({ id });
    if (!user) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found." });

    return res.status(200).json(user.notifications);

});

module.exports = router;