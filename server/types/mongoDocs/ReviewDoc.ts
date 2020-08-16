import { Document } from "mongoose";
import IReview from "../IReview";

export default interface ReviewDoc extends Document, IReview {
    _id: any;
}
