import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { BotType } from "src/bot/gqlTypes/bot.type";
import { Bot } from "src/bot/bot.schema";
import { VoteService } from "./vote.service";
import { VoteType } from "./gqlTypes/vote.type";

@Resolver(() => VoteType)
export class VoteResolver {
    constructor(private service: VoteService) { }

    @ResolveField("bot", () => BotType, { nullable: true })
    public bot(@Parent() user: VoteType): Promise<Bot> {
        return this.service.getBot(user);
    }
}
