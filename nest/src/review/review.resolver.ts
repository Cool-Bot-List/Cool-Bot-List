import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { ReviewService } from "./review.service";
import { BotType } from "src/bot/gqlTypes/bot.type";
import { Bot } from "src/bot/bot.schema";
import { Review } from "./review.schema";
import { ReviewType } from "./gqlTypes/review.type";

@Resolver(() => ReviewType)
export class ReviewResolver {
    constructor(private service: ReviewService) { }

    @ResolveField("bot", () => BotType)
    public bot(@Parent() review: Review): Promise<Bot> {
        return this.service.getBot(review);
    }
}
