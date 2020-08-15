import { Document } from "mongoose";
import IBot from "../IBot";

export default interface BotDoc extends Document, IBot {
    _id: any;
    id: string;
}
