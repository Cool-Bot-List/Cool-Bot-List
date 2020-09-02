import { ObjectType, Field, ID } from "@nestjs/graphql";
import { OwnerReplyType } from "../../owner-reply/gql-types/owner-reply.type";
import { BotType } from "src/bot/gql-types/bot.type";
import { UserType } from "src/user/gql-types/user.type";

@ObjectType()
export class ReviewType {
    /**
     * The mongodb object's _id.
     */
    @Field(() => ID)
    _id: string;
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
    @Field(() => OwnerReplyType, { nullable: true })
    ownerReply: OwnerReplyType;
    /**
     * An array of user objects that have liked this review.
     */
    @Field(() => [UserType])
    likes: UserType[];
    /**
     * An array of user objects that have disliked this review.
     */
    @Field(() => [UserType])
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