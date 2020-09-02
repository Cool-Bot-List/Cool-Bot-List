import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { ReviewService } from "./review.service";
import { BotType } from "src/bot/gqlTypes/bot.type";
import { Bot } from "src/bot/bot.schema";
import { Review } from "./review.schema";
import { ReviewType } from "./gqlTypes/review.type";
import { UserType } from "src/user/gqlTypes/user.type";
import { User } from "src/user/user.schema";
import { OwnerReplyType } from "src/owner-reply/gqlTypes/owner-reply.type";
import { OwnerReply } from "src/owner-reply/interfaces/ownerReply.interface";

@Resolver(() => ReviewType)
export class ReviewResolver {

    constructor(private service: ReviewService) { }

    @ResolveField("bot", () => BotType)
    public bot(@Parent() review: Review): Promise<Bot> {
        return this.service.getBot(review);
    }

    @ResolveField("user", () => UserType)
    public user(@Parent() review: Review): Promise<User> {
        return this.service.getUser(review);
    }

    @ResolveField("likes", () => [UserType])
    public likes(@Parent() review: Review): Promise<User[]> {
        return this.service.getUsersThatLiked(review);
    }

    @ResolveField("dislikes", () => [UserType])
    public dislikes(@Parent() review: Review): Promise<User[]> {
        return this.service.getUsersThatDisliked(review);
    }

    @ResolveField("ownerReply", () => OwnerReplyType, { nullable: true })
    public ownerReply(@Parent() review: Review): Promise<OwnerReply> {
        return this.service.getOwnerReply(review);
    }
}
