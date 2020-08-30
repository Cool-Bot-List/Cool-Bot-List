import { Resolver, Query } from "@nestjs/graphql";
import { BotService } from "./bot.service";
import { BotType } from "./gqlTypes/bot.type";
import { Bot } from "./bot.schema";

@Resolver()
export class BotResolver {
    constructor(private service: BotService) { }

    @Query(() => [BotType], { nullable: true })
    public guilds(): Promise<Bot[]> {
        return this.service.getAll();
    }

}
