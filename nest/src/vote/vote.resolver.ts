import { Resolver, ResolveField, Parent, Args, Mutation } from "@nestjs/graphql";
import { BotType } from "src/bot/gql-types/bot.type";
import { Bot } from "src/bot/bot.schema";
import { VoteService } from "./vote.service";
import { VoteType } from "./gql-types/vote.type";
import { Vote } from "./interfaces/vote.interface";
import { HttpException } from "@nestjs/common";

@Resolver(() => VoteType)
export class VoteResolver {
    constructor(private service: VoteService) { }

    @ResolveField("bot", () => BotType, { nullable: true })
    public bot(@Parent() user: VoteType): Promise<Bot> {
        return this.service.getBot(user);
    }

    @Mutation(() => VoteType)
    public voteBot(@Args("botId") botId: string, @Args("userId") userId: string): Promise<Vote | HttpException> {
        return this.service.vote(botId, userId);
    }
}
