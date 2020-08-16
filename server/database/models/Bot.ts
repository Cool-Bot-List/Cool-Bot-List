import { Schema, model } from "mongoose";
import BotDoc from "../../types/mongoDocs/BotDoc";

const Bot = new Schema({
    id: String,
    tag: String,
    avatarUrl: String,
    prefix: String,
    description: String,
    owners: Array,
    website: String,
    inviteLink: String,
    helpCommand: String,
    supportServer: String,
    library: String,
    averageRating: { type: Number, default: null, required: false },
    isApproved: { type: Boolean, default: null, required: false },
    reviews: { type: Array, default: [], required: false },
    votes: { type: Number, default: 0, required: false },
    tags: { type: Array, default: [], required: false },
    servers: { type: Number, default: null, required: false },
    users: { type: Number, default: null, required: false },
    presence: { type: String, default: null, required: false },
});

export default model<BotDoc>("bots", Bot);
