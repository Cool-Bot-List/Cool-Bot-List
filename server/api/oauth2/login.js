const router = require("express").Router();
const passport = require("passport");
const Users = require("../../database/models/User");

router.get("/login", passport.authenticate("discord"));
router.get("/login/redirect", passport.authenticate("discord"), async (req, res) => {
    if (req.user.isNew) {
        res.redirect("http://localhost:3000/bio/add");
        const user = await Users.findOne({ id: req.user.id });
        user.isNew = false;
    } else if (!req.user.isNew) {
        res.redirect(`http://localhost:3000/users/${req.user.id}`);
    } else {
        res.redirect("http://localhost:3000");
    }
    res.status(200).json({ message: "Yes" });
});

module.exports = router;
