import { ObjectType, Field } from "@nestjs/graphql";
import { OwnerReplyType } from "./ownerReply.type";
import { BotType } from "src/bot/gqlTypes/bot.type";
import { UserType } from "src/user/gqlTypes/user.type";

@ObjectType()
export class ReviewType {
    /**
     * The bot object that the review belongs too.
     */
    @Field(() => BotType)
    bot: BotType;
    /**
     * The id of the user that made the review.
     */
    @Field(() => UserType)
    user: UserType;
    /**
     * The actual review content of the review.
     */
    @Field()
    review: string;
    /**
     * The owners reply to the review.
     */
    @Field(() => OwnerReplyType)
    ownerReply: OwnerReplyType;
    /**
     * An array of user objects that have liked this review.
     */
    @Field(() => UserType)
    likes: UserType[];
    /**
     * An array of user objects that have disliked this review.
     */
    @Field(() => UserType)
    dislikes: UserType[];
    /**
     * The rating of this review
     */
    @Field()
    rating: number;
    /**
     * The date that this review was made.
     */
    @Field()
    date: Date;
}