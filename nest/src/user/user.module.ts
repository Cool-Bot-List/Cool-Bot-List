import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BotModule } from "src/bot/bot.module";
import { Bot, BotSchema } from "src/bot/bot.schema";
import { EventsModule } from "src/events/events.module";
import { OwnerReplyModule } from "src/owner-reply/owner-reply.module";
import { ReviewModule } from "src/review/review.module";
import { Review, ReviewSchema } from "src/review/review.schema";
import { VoteModule } from "src/vote/vote.module";
import { UserResolver } from "./user.resolver";
import { User, UserSchema } from "./user.schema";
import { UserService } from "./user.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Bot.name, schema: BotSchema },
            { name: Review.name, schema: ReviewSchema },
        ]),
        VoteModule,
        EventsModule,
        BotModule,
        ReviewModule,
        OwnerReplyModule,
    ],
    providers: [UserResolver, UserService],
})
export class UserModule { }
