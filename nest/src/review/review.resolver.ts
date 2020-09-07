import { HttpException } from "@nestjs/common";
import { Args, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Bot } from "src/bot/bot.schema";
import { BotType } from "src/bot/gql-types/bot.type";
import { OwnerReplyType } from "src/owner-reply/gql-types/owner-reply.type";
import { OwnerReply } from "src/owner-reply/interfaces/ownerReply.interface";
import { UserType } from "src/user/gql-types/user.type";
import { User } from "src/user/user.schema";
import { ReviewCreatable } from "./gql-types/review-creatable.input";
import { ReviewType } from "./gql-types/review.type";
import { Review } from "./review.schema";
import { ReviewService } from "./review.service";

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

    @Mutation(() => ReviewType)
    public createReview(@Args("reviewCreatable") data: ReviewCreatable): Promise<Review | HttpException> {
        return this.service.create(data);
    }

    @Mutation(() => ReviewType)
    public updateReview(@Args("mongoId") mongoId: string, @Args("review") review: string): Promise<Review | HttpException> {
        return this.service.update(mongoId, review);
    }

    @Mutation(() => ReviewType)
    public likeReview(@Args("mongoId") mongoId: string, @Args("userId") userId: string): Promise<Review | HttpException> {
        return this.service.like(mongoId, userId);
    }

    @Mutation(() => ReviewType)
    public dislikeReview(@Args("mongoId") mongoId: string, @Args("userId") userId: string): Promise<Review | HttpException> {
        return this.service.dislike(mongoId, userId);
    }

    @Mutation(() => ReviewType)
    public deleteReview(@Args("mongoId") mongoId: string): Promise<Review | HttpException> {
        return this.service.delete(mongoId);
    }
}
