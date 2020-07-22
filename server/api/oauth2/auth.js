const router = require("express").Router();
const passport = require("passport");

router.get("/login", passport.authenticate("discord"));
router.get("/login/redirect", passport.authenticate("discord"), (req, res) => {
    if (req.user.askedBioQueston) {
        res.redirect(`http://localhost:3000/users/${req.user.id}`);
    } else {
        res.redirect("http://localhost:3000/bio/add");
    }
    res.status(200).json({ message: "Yes" });
});

module.exports = router;
