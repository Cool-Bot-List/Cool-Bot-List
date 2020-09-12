import { Module } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { VoteResolver } from "./vote.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Bot, BotSchema } from "src/bot/bot.schema";
import { User, UserSchema } from "src/user/user.schema";
import { EventsModule } from "src/events/events.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bot.name, schema: BotSchema },
            { name: User.name, schema: UserSchema },
        ]),
        EventsModule,
        NotificationModule,
    ],
    providers: [VoteService, VoteResolver],
})
export class VoteModule { }
