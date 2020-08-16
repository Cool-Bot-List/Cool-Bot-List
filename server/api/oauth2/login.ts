import { Router } from "express";
const router = Router();
import passport from "passport";
import Users from "../../database/models/User";


router.get("/", passport.authenticate("discord"));

export let request: any;
router.get("/redirect", passport.authenticate("discord"), async (req, res) => {
    //@ts-ignore
    if (req.user.newUser as any) {
        res.redirect("http://localhost:3000/bio/add");
        //@ts-ignore
        const user = await Users.findOne({ id: req.user.id });
        user.newUser = false;
        await user.save();
        //@ts-ignore
    } else if (!req.user.newUser) {
        //@ts-ignore
        res.redirect(`http://localhost:3000/users/${req.user.id}`);
    } else {
        res.redirect("http://localhost:3000");
    }
    console.log("test");
    request = req;
    res.status(200).json({ message: "Yes" });
});

export default router;
