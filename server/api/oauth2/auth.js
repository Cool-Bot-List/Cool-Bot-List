const router = require("express").Router();
const passport = require("passport");

router.get("/login", passport.authenticate("discord"));
router.get("/login/redirect", passport.authenticate("discord"), (req, res) => {
    res.status(200).json({ message: "Yes" });
});


module.exports = router;