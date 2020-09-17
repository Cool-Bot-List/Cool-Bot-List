import { HttpException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { PublicApiGqlGuard } from "./public-api-gql.guard";
import { PublicApiService } from "./public-api.service";
import { PublicApiBotUpdatable } from "./types/public-api-bot-updatable.input";

@Resolver()
export class PublicApiResolver {
    constructor(private service: PublicApiService) { }

    @Mutation(() => String)
    @UseGuards(PublicApiGqlGuard)
    public updateMyBot(@Args("botUpdatable") botUpdatable: PublicApiBotUpdatable): Promise<string | HttpException> {
        return this.service.update(botUpdatable);
    }
}
