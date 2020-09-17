import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Bot, BotSchema } from "src/bot/bot.schema";
import { EventsModule } from "src/events/events.module";
import { User, UserSchema } from "src/user/user.schema";
import { PublicApiGqlGuard } from "./public-api-gql.guard";
import { PublicApiController } from "./public-api.controller";
import { PublicApiGuard } from "./public-api.guard";
import { PublicApiResolver } from "./public-api.resolver";
import { PublicApiService } from "./public-api.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bot.name, schema: BotSchema },
            { name: User.name, schema: UserSchema },
        ]),
        EventsModule,
    ],
    providers: [PublicApiService, PublicApiResolver, PublicApiGuard, PublicApiGqlGuard],
    controllers: [PublicApiController],
})
export class PublicApiModule { }
