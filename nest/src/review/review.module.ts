import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Review, ReviewSchema } from "./review.schema";
import { ReviewResolver } from "./review.resolver";
import { ReviewService } from "./review.service";
import { User, UserSchema } from "src/user/user.schema";
import { Bot, BotSchema } from "src/bot/bot.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Review.name, schema: ReviewSchema },
            { name: User.name, schema: UserSchema },
            { name: Bot.name, schema: BotSchema },
        ]),
    ],
    providers: [ReviewResolver, ReviewService],
})
export class ReviewModule { }
