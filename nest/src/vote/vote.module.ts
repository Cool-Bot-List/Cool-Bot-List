import { Module } from "@nestjs/common";
import { VoteService } from "./vote.service";
import { VoteResolver } from "./vote.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Bot, BotSchema } from "src/bot/bot.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bot.name, schema: BotSchema },
        ]),
    ],
    providers: [VoteService, VoteResolver],
})
export class VoteModule { }
