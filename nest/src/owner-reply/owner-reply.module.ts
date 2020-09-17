import { Module } from "@nestjs/common";
import { OwnerReplyResolver } from "./owner-reply.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Review, ReviewSchema } from "src/review/review.schema";
import { User, UserSchema } from "src/user/user.schema";
import { OwnerReplyService } from "./owner-reply.service";
import { BotSchema, Bot } from "src/bot/bot.schema";
import { EventsModule } from "src/events/events.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Review.name, schema: ReviewSchema },
            { name: User.name, schema: UserSchema },
            { name: Bot.name, schema: BotSchema },
        ]),
        EventsModule,
        NotificationModule,
    ],
    providers: [OwnerReplyResolver, OwnerReplyService],
    exports: [OwnerReplyService],
})
export class OwnerReplyModule { }
