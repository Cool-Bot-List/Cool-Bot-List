import { Module } from "@nestjs/common";
import { ReviewModule } from "src/review/review.module";
import { BotResolver } from "./bot.resolver";
import { BotService } from "./bot.service";
import { MongooseModule } from "@nestjs/mongoose";
import { BotSchema, Bot } from "./bot.schema";
import { User, UserSchema } from "src/user/user.schema";
import { Review, ReviewSchema } from "src/review/review.schema";
import { EventsModule } from "src/events/events.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bot.name, schema: BotSchema },
            { name: User.name, schema: UserSchema },
            { name: Review.name, schema: ReviewSchema },
        ]),
        ReviewModule,
        EventsModule,
        NotificationModule,
    ],
    providers: [BotResolver, BotService],
    exports: [BotService],
})
export class BotModule { }
