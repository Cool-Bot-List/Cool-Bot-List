import { Resolver, Query, Args, ResolveField, Parent } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { UserType } from "./gqlTypes/user.type";
import { User } from "./user.schema";
import { VoteType } from "src/vote/gqlTypes/vote.type";
import { Vote } from "src/vote/interfaces/vote.interface";
import { BotType } from "src/bot/gqlTypes/bot.type";
import { Bot } from "src/bot/bot.schema";
import { HttpException } from "@nestjs/common";

@Resolver(() => UserType)
export class UserResolver {
    constructor(private service: UserService) { }

    @Query(() => [UserType], { nullable: true })
    public users(): Promise<User[]> {
        return this.service.getAll();
    }

    @Query(() => UserType, { nullable: true })
    public user(@Args("id") id: string): Promise<User> {
        return this.service.get(id);
    }

    @ResolveField("bots", () => [BotType])
    public bots(@Parent() user: User): Promise<Bot[]> {
        return this.service.getBots(user);
    }

    @ResolveField("bot", () => BotType, { nullable: true })
    public bot(@Parent() user: User, @Args("id") id: string): Promise<Bot | HttpException> {
        return this.service.getBot(user, id);
    }

    @ResolveField("vote", () => VoteType, { nullable: true })
    public vote(@Parent() user: User): Promise<Vote> {
        return this.service.getVote(user);
    }
}

