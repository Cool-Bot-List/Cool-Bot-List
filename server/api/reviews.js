const express = require("express");
const router = express.Router();
const Reviews = require("../database/models/Review");


// Post user review -- requires Oauth to actually function --
router.post("/reviews/:id", async (req, res) => {

    const { id } = req.params;
    const { userID, review } = req.body;
    const newReview = new Reviews({ botID: id, userID, review, reply: "", likes: 0, dislikes: 0 });
    try {
        newReview.save();
    } catch (err) {
        res.status(500).json({ message: "Something went wrong and the review was not saved to the database", error: "Internal Server Error." });
    }

    res.status(200).json({ message: "Successfully saved the review to the database" });

});

module.exports = router;

