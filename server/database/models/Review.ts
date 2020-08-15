import { Schema, model } from "mongoose";
import ReviewDoc from "../../types/mongoDocs/ReviewDoc";

const Review = new Schema({
    botId: String,
    userId: String,
    review: String,
    ownerReply: {
        userId: { type: String, default: "", required: false },
        review: { type: String, default: "", require: false },
        likes: { type: Array, default: [], required: false },
        dislikes: { type: Array, default: [], required: false },
        date: { type: Date, default: null, required: false },
    },
    likes: { type: Array, default: [], required: false },
    dislikes: { type: Array, default: [], required: false },
    rating: Number,
    date: { type: Date, default: new Date(), required: false },
});

export default model<ReviewDoc>("reviews", Review);
