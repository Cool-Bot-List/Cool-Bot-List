import { Resolver, Query, Args, ResolveField, Parent } from "@nestjs/graphql";
import { BotService } from "./bot.service";
import { BotType } from "./gql-types/bot.type";
import { Bot } from "./bot.schema";
import { UserType } from "src/user/gql-types/user.type";
import { User } from "src/user/user.schema";
import { HttpException } from "@nestjs/common";
import { ReviewType } from "src/review/gql-types/review.type";
import { Review } from "src/review/review.schema";

@Resolver(() => BotType)
export class BotResolver {
    constructor(private service: BotService) { }

    @Query(() => [BotType], { nullable: true })
    public bots(): Promise<Bot[]> {
        return this.service.getAll();
    }

    @Query(() => BotType, { nullable: true })
    public bot(@Args("id") id: string): Promise<Bot> {
        return this.service.get(id);
    }

    @ResolveField("owners", () => [UserType])
    public owners(@Parent() bot: BotType): Promise<User[]> {
        return this.service.getOwners(bot);
    }

    @ResolveField("owner", () => UserType)
    public owner(
        @Parent() bot: BotType, @Args("id", { nullable: true }) id: string, @Args("index", { nullable: true }) index: number
    ): Promise<User | HttpException> {
        return this.service.getOwner(bot, id, index);
    }

    @ResolveField("reviews", () => ReviewType)
    public reviews(@Parent() bot: BotType): Promise<Review[]> {
        return this.service.getReviews(bot);
    }

    @ResolveField("review", () => ReviewType, { nullable: true })
    public review(
        @Parent() bot: BotType, @Args("mongoId", { nullable: true }) mongoId: string, @Args("index", { nullable: true }) index: number
    ): Promise<Review | HttpException> {
        return this.service.getReview(bot, mongoId, index);
    }
}
