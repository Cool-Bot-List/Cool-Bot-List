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
import { RateLimitService } from "./rate-limit/rate-limit.service";
import { RateLimitGqlGuard } from "./rate-limit/rate-limit-gql.guard";
import { RateLimitGuard } from "./rate-limit/rate-limit.guard";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bot.name, schema: BotSchema },
            { name: User.name, schema: UserSchema },
        ]),
        EventsModule,
    ],
    providers: [
        PublicApiService,
        PublicApiResolver,
        PublicApiGuard,
        PublicApiGqlGuard,
        RateLimitService,
        RateLimitGuard,
        RateLimitGqlGuard,
    ],
    controllers: [PublicApiController],
})
export class PublicApiModule { }
