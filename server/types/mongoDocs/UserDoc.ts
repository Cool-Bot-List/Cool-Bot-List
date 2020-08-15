import { Document } from "mongoose";
import IUser from "../IUser";

export default interface UserDoc extends Document, IUser {
    _id: any;
    id: string;
}
