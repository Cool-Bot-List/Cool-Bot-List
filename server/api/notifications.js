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
    
    const notificationMessage = user.notifications.find(n => n.message === `${message}`);
    
    if (!notificationMessage) return res.status(404).json({ message: "That notification doesn't exist in the database.", error: "Not Found." });
    const index = user.notifications.findIndex(n => n.message === notificationMessage.message);
  
    if (method === notificationMethods.READ) {
        user.notifications[index].read =  "Bruh" ;
    }
    //yeah idk i think we should be done for today just commit and push so i can TRY to fix it tommorow
    if (method === notificationMethods.UNREAD) {
        user.notifications[index].read = false;
    } // aight
    try { 
        await user.save(); //one sec gonna do this on my postman whats the body 
    
        /*
        {
            "message": "undefined#undefined just rated your bot 5 stars!",
            "method": "read",
            "userId": "408080307603111936"
        }
        */ // smh nothing is working ;( 😡😡😡
        //pc is so slow smh
        
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong while saving to the database.", error: "Internal Server Error." });
    }

    return res.status(200).json({ message: `Successfully set the notification to ${method}.` });
});

module.exports = router;
