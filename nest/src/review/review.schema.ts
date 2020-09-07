import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { OwnerReply } from "../owner-reply/interfaces/ownerReply.interface";
import { Document } from "mongoose";

@Schema()
export class Review extends Document {
    /**
    * The id of the bot that the review belongs too.
    */
    @Prop()
    botId: string;
    /**
    * The id of the user that made the review.
    */
    @Prop()
    userId: string;
    /**
    * The actual review content of the review.
    */
    @Prop()
    review: string;
    /**
    * The owners reply to the review.
    */
    @Prop({
        userId: { type: String, default: "", required: false },
        review: { type: String, default: "", require: false },
        likes: { type: Array, default: [], required: false },
        dislikes: { type: Array, default: [], required: false },
        date: { type: Date, default: "", required: false },
    })
    ownerReply: OwnerReply;
    /**
    * An array of userIds that have liked this review.
    */
    @Prop({ default: [], required: false })
    likes: string[];
    /**
    * An array of userIds that have disliked this review.
    */
    @Prop({ default: [], required: false })
    dislikes: string[];
    /**
    * The rating of this review.
    */
    @Prop()
    rating: number;
    /**
    * The date that this review was made.
    */
    @Prop({ default: new Date(), required: false })
    date: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
