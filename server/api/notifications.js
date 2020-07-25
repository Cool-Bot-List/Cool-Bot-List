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

router.put("/", async (req, res) => {
    let { message, method, userId } = req.body;
    if (!message || !method || !userId) return res.status(400).json({ message: "You are missing properties.", error: "Bad Request." });
    let id = userId;
    let user = await Users.findOne({ id });
    if (!user) return res.status(404).json({ message: "That user doesn't exist in the database.", error: "Not Found." });
    
    let notificationMessage = await user.notifications.find(n => n.message === `${message}`);
    
    if (!notificationMessage) return res.status(404).json({ message: "That notification doesn't exist in the database.", error: "Not Found." });
    let index = await user.notifications.findIndex(n => n.message === notificationMessage.message);
  
    // if (method === notificationMethods.READ) {
    //     user.notifications[index].read = true;
    // }

    // if (method === notificationMethods.UNREAD) {
    //     user.notifications[index].read = false;
    // } 


    if (method === notificationMethods.READ) {
        user.notifications[index].read.push(true);
        user.notifications[index].read.shift();
    }

    if (method === notificationMethods.UNREAD) {
        user.notifications[index].read.push(false);
        user.notifications[index].read.shift();
    }
    console.log(user.notifications[0].read, "user before save");
    try { 
        console.log((await user.save()).notifications[0].read, "uh save thing?");
        await user.save();
        let newUser = await Users.findOne({ id });
        console.log(newUser.notifications[0].read, "after save");
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong while saving to the database.", error: "Internal Server Error." });
    }

    return res.status(200).json({ message: `Successfully set the notification to ${method}.` });
});

module.exports = router;
