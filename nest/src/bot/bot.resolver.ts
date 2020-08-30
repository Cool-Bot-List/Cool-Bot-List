import { Resolver, Query, Args, ResolveField, Parent } from "@nestjs/graphql";
import { BotService } from "./bot.service";
import { BotType } from "./gqlTypes/bot.type";
import { Bot } from "./bot.schema";
import { UserType } from "src/user/gqlTypes/user.type";
import { User } from "src/user/user.schema";
import { HttpException } from "@nestjs/common";

@Resolver(() => BotType)
export class BotResolver {
    constructor(private service: BotService) { }

    @Query(() => [BotType], { nullable: true })
    public bots(): Promise<Bot[]> {
        return this.service.getAll();
    }

    @Query(() => BotType, { nullable: true })
    public bot(@Args("id") id: string): Promise<Bot> {
        return this.service.get(id);
    }

    @ResolveField("owners", () => [UserType], { nullable: true })
    public owners(@Parent() bot: BotType): Promise<User[]> {
        return this.service.getOwners(bot);
    }

    @ResolveField("owner", () => UserType, { nullable: true })
    public owner(
        @Parent() bot: BotType, @Args("id", { nullable: true }) id: string, @Args("index", { nullable: true }) index: number
    ): Promise<User | HttpException> {
        return this.service.getOwner(bot, id, index);
    }

}
